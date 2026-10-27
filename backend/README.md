# DKP Innovations — Production Backend

Production-ready, observable, and secure Java 21 / Spring Boot 3.4 REST API backend for the **DKP Innovations** platform.

This backend powers two unified form workflows:
1. **Careers Application Submissions** (`POST /api/careers/applications` & `POST /api/careers/apply`) with in-memory resume attachment delivery, file signature validation, candidate acknowledgement, and recruiter notification.
2. **Contact Us & Services Enquiry Submissions** (`POST /api/contact`) supporting both general inquiries and service-specific project enquiries, with client confirmation and team notification.

---

## 1. Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS REST /api/*
┌──────────────────────────▼─────────────────────────────┐
│                 DKP Spring Boot Backend                │
│                                                        │
│  [CORS Allowlist]   [IP Rate Limiter]   [Correlation]  │
│  [File Signature Validator (Magic Bytes)]   [Honeypot] │
│                                                        │
│       Careers API            Contact & Services API    │
│    (/api/careers/*)              (/api/contact)        │
└──────────┬─────────────────────────────┬───────────────┘
           │                             │
    ┌──────▼──────┐               ┌──────▼──────┐
    │ Neon        │               │ Resend API  │
    │ PostgreSQL  │               │ (Attachment │
    │ (Flyway)    │               │  & Outbox)  │
    └─────────────┘               └─────────────┘
```

- **In-Memory Resume Email Attachments**: Resumes are validated (magic bytes, MIME type, configurable max size up to 5 MB) and attached directly to recruiter notification emails via Resend API (`POST https://api.resend.com/emails`) in memory. Resumes are **never stored as binaries in PostgreSQL** and **require no cloud object storage (S3/R2)**.
- **Resilient Transactional Outbox**: Applicant acknowledgements and contact notifications are saved in the `email_outbox` table in the database transaction and processed asynchronously by the outbox scheduler with exponential backoff and jitter.
- **Atomic Failure Handling**: If database persistence or initial recruiter email delivery fails, the request fails with an error status (503 / 500) and no false success is returned to the applicant.
- **Data Minimization & Redaction**: Customer and candidate personal data (email, phone, name) is redacted from console and server log streams via Logback pattern converters.

---

## 2. Prerequisites & Supported Versions

| Technology | Recommended / Supported Version |
|---|---|
| **Java** | OpenJDK 21 LTS (or Java 24/25) |
| **Spring Boot** | 3.4.3 |
| **Maven** | 3.9+ (or included `./mvnw`) |
| **Database** | PostgreSQL 15+ / Neon Serverless Postgres |
| **Email Service** | Resend API (HTTP REST) |
| **Storage Mode** | Direct Email Attachments (Zero Object Storage) |
| **Docker** | 24+ |

---

## 3. Environment Variables Reference

| Variable | Description | Example / Default | Required in Prod? |
|---|---|---|:---:|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile (`prod` or `local`) | `prod` | Yes |
| `PORT` | HTTP Server port (Render sets automatically) | `8080` | Yes |
| `FRONTEND_URL` | Canonical frontend domain | `https://dkpinnovation.com` | Yes |
| `CORS_ALLOWED_ORIGINS` | Comma-separated CORS origin allowlist | `https://dkpinnovation.com` | Yes |
| `DATABASE_URL` | PostgreSQL JDBC connection URL | `jdbc:postgresql://ep-xxx.neon.tech/neondb?sslmode=require` | **Yes** |
| `DATABASE_USERNAME` | PostgreSQL database user | `neondb_owner` | **Yes** |
| `DATABASE_PASSWORD` | PostgreSQL database password | `secret_password` | **Yes** |
| `DB_POOL_SIZE` | HikariCP max connection pool size | `5` | No (default: 5) |
| `RESEND_API_KEY` | Resend API key | `re_123456789...` | **Yes** |
| `MAIL_FROM` | Verified sender address on Resend | `DKP Innovations <noreply@dkpinnovation.com>` | **Yes** |
| `CAREERS_TO` | Recipient for candidate applications | `careers@dkpinnovation.com` | **Yes** |
| `CONTACT_TO` | Recipient for contact & service submissions | `info@dkpinnovation.com` | **Yes** |
| `MAX_FILE_SIZE_BYTES` | Maximum allowed upload size in bytes | `5242880` (5 MB) | No (default: 5 MB) |
| `SWAGGER_ENABLED` | Enable OpenAPI Swagger UI | `false` in prod | No |

---

## 4. Local Development Setup

### 1. Configure Local Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
For local testing, the default profile uses in-memory H2 database or local PostgreSQL with simulated Resend delivery if test keys are used.

### 2. Build & Test
```bash
# Run unit and integration tests (uses in-memory H2 PostgreSQL mode)
./mvnw clean test

# Build executable fat JAR
./mvnw clean package -DskipTests
```

### 3. Run Application
```bash
./mvnw spring-boot:run
```
The server starts at `http://localhost:8080`.

---

## 5. Neon PostgreSQL Setup & Migrations

1. Sign in to [Neon](https://neon.tech) and create a PostgreSQL database.
2. Copy the connection string. In Neon, select **JDBC** format:
   ```text
   jdbc:postgresql://ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Set `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`.
4. Flyway automatically runs database migrations on startup:
   - `V1__init_schema.sql` (Creates `job_applications`, `contact_submissions`, `email_outbox`)
   - `V2__resume_attachment_mode.sql` (Adjusts `job_applications.resume_storage_key` to support attachment-only mode)

---

## 6. Resend Email Integration Setup

1. Sign up at [Resend](https://resend.com).
2. Add and verify your sending domain (e.g., `dkpinnovation.com`) by adding the DKIM/SPF TXT records to your DNS registrar.
3. In Resend Dashboard, go to **API Keys** -> **Create API Key** with sending access.
4. Set `RESEND_API_KEY=re_...` in your deployment environment variables.
5. Set `MAIL_FROM=DKP Innovations <noreply@dkpinnovation.com>`.

---

## 7. Resume Delivery Architecture (In-Memory Email Attachments)

Resumes submitted by candidates are delivered directly to the recruitment inbox (`CAREERS_TO`) as attachments via Resend:

1. **Validation**: The backend inspects the uploaded file's magic bytes (PDF `%PDF-`, DOCX ZIP `PK..`, DOC OLE), content-type, extension, and file size (default max 5 MB). Disguised or corrupted files are rejected immediately with HTTP 400.
2. **In-Memory Streaming**: The file bytes are Base64-encoded in memory and dispatched in the `attachments` array of the Resend API payload:
   ```json
   {
     "from": "DKP Innovations <noreply@dkpinnovation.com>",
     "to": ["careers@dkpinnovation.com"],
     "subject": "New Job Application: Senior Java Engineer - Aarav Patel",
     "attachments": [
       {
         "filename": "Aarav_Patel_Resume.pdf",
         "content": "JVBERi0xLjQKJ...",
         "contentType": "application/pdf"
       }
     ]
   }
   ```
3. **Database Metadata**: Only application metadata is saved in PostgreSQL (`reference_id`, applicant fields, `resume_original_filename`, `resume_content_type`, `resume_file_size_bytes`, `status`). No binary data is stored in the database.
4. **No Cloud Object Storage Required**: Eliminates S3 bucket management, IAM keys, lifecycle rules, presigned URLs, and monthly storage costs.
5. **Atomic Delivery**: If the recruiter email delivery fails, the transaction rolls back and an error (HTTP 503) is returned to the applicant so they can retry.

---

## 8. REST API Documentation & Examples

### Careers Application
- **Method**: `POST`
- **Path**: `/api/careers/applications` (or alias `/api/careers/apply`)
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `fullName`: (string, required, 2-150 chars)
  - `email`: (string, required, valid email)
  - `phone`: (string, required, 7-25 chars)
  - `position`: (string, required)
  - `department`: (string, required)
  - `experienceLevel`: (string, required)
  - `workArrangement`: (string, required)
  - `keySkills`: (string, required)
  - `coverLetter`: (string, required, min 20 chars)
  - `resume`: (binary file, required, PDF/DOCX/DOC up to 5 MB)
  - `privacyConsent`: (boolean, required: `true`)
  - `linkedInUrl`: (string, optional)
  - `portfolioUrl`: (string, optional)
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "referenceId": "DKP-APP-20261027-ABC123",
    "message": "Your application has been received successfully...",
    "timestamp": "2026-10-27T13:40:00Z"
  }
  ```

### Contact Us / Services Enquiry
- **Method**: `POST`
- **Path**: `/api/contact`
- **Content-Type**: `application/json`
- **Description**: Unified endpoint handling both general contact messages and service-specific project enquiries.
- **Body Example (Service Enquiry)**:
  ```json
  {
    "fullName": "Aarav Patel",
    "email": "aarav@enterprise.com",
    "phone": "+91 98765 43210",
    "service": "IT & Digital Solutions",
    "message": "We require a scalable web infrastructure with automated inventory and CRM integration."
  }
  ```
- **Body Example (General Contact)**:
  ```json
  {
    "fullName": "Pooja Reddy",
    "email": "pooja@company.com",
    "phone": "+91 98450 11223",
    "service": "General Inquiry",
    "message": "Interested in connecting with your executive team regarding business partnerships."
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "referenceId": "DKP-CNT-20261027-KLM456",
    "message": "Thank you! Your message has been received. Our team will get back to you shortly.",
    "timestamp": "2026-10-27T13:40:00Z"
  }
  ```

### Health & Liveness
- **Method**: `GET`
- **Path**: `/actuator/health`
- **Response**: `{"status": "UP"}`

---

## 9. Render Deployment Instructions

### Option A: Automatic via Blueprint (`render.yaml`)
1. In the Render Dashboard, click **New +** -> **Blueprint**.
2. Connect your Git repository (`https://github.com/KARANPERUMAL/dkp-website`).
3. Select `render.yaml`.
4. In the Render dashboard, supply the secret environment variables (`DATABASE_URL`, `DATABASE_PASSWORD`, `RESEND_API_KEY`, etc.).
5. Click **Apply**.

### Option B: Manual Web Service Setup
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select your repository.
3. Configure:
   - **Environment**: Docker
   - **Docker Context**: `./backend`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Health Check Path**: `/actuator/health`
4. Add the Environment Variables from the table above in Section 3.
5. Deploy.

---

## 10. Frontend Connection Setup

In the `frontend` folder:
1. Create `.env`:
   ```env
   VITE_API_BASE_URL=https://your-dkp-backend.onrender.com
   ```
2. Build and verify:
   ```bash
   cd frontend
   npm run build
   ```

---

## 11. Security & Operational Checklist

- [x] **File Validation**: Strict magic byte signature checking prevents disguised executables from being uploaded.
- [x] **5 MB File Limit**: Enforced at Spring MVC multipart layer and application service.
- [x] **Path Traversal Protection**: Original filename is strictly sanitized before storing metadata and attaching to email.
- [x] **Zero Object Storage / No Disk Blobs**: Resumes stream in memory directly as attachments to Resend API; no cloud buckets or permanent disk files.
- [x] **Log Redaction**: Email addresses and telephone numbers are masked from logs via `DataMaskingConverter`.
- [x] **Rate Limiting**: Sliding token bucket enforces IP-based rate limiting on all public submission endpoints (HTTP 429 when exceeded).
- [x] **Honeypot Protection**: Anti-bot honeypot fields reject automated submissions.
- [x] **Generic Errors**: Internal database exceptions and stack traces are suppressed from client responses.
- [x] **Resilient Email Delivery**: Outbox scheduler retries transient failures with exponential backoff and jitter. Permanent failures (e.g. invalid recipient) are marked `PERMANENT_FAILURE` without blocking the database transaction.
- [x] **Container Security**: Multi-stage Docker build runs as unprivileged `appuser`.
