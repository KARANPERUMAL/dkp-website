# DKP Innovations — Production Backend

Production-ready, observable, and secure Java 21 / Spring Boot 3.4 REST API backend for the **DKP Innovations** platform.

This backend powers:
1. **Careers Application Submissions** (`POST /api/careers/applications` & `POST /api/careers/apply`) with private resume document upload, file signature validation, and candidate notifications.
2. **Services Enquiry Submissions** (`POST /api/services/enquiries`) with service catalogue verification and client confirmations.
3. **Contact Us Submissions** (`POST /api/contact`) supporting direct consultation inquiries.

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
│   Careers API       Services API       Contact API     │
│  (/api/careers/*)   (/api/services/*)   (/api/contact) │
└──────────┬─────────────────┬──────────────────┬────────┘
           │                 │                  │
    ┌──────▼──────┐   ┌──────▼──────┐    ┌──────▼──────┐
    │ S3 Resume   │   │ Neon        │    │ Resend API  │
    │ Storage     │   │ PostgreSQL  │    │ Email Outbox│
    │ (Private)   │   │ (Flyway)    │    │ (Async)     │
    └─────────────┘   └─────────────┘    └─────────────┘
```

- **Resilient Transactional Outbox**: All email dispatches are saved in the `email_outbox` table in the same database transaction as the submission. Submissions are never lost or delayed by email provider latency or temporary downtime.
- **Data Minimization & Redaction**: Customer and candidate personal data (email, phone, name) is redacted from console and server log streams via Logback pattern converters.
- **Private S3 Resume Storage**: Uploaded resumes are never stored permanently on ephemeral containers. Files are validated by magic byte headers (rejecting disguised executables) and assigned random UUID object keys in private cloud object storage.

---

## 2. Prerequisites & Supported Versions

| Technology | Recommended / Supported Version |
|---|---|
| **Java** | OpenJDK 21 LTS (or Java 24/25) |
| **Spring Boot** | 3.4.3 |
| **Maven** | 3.9+ (or included `./mvnw`) |
| **Database** | PostgreSQL 15+ / Neon Serverless Postgres |
| **Email Service** | Resend API (HTTP REST) |
| **Object Storage** | S3-compatible (AWS S3, Cloudflare R2, MinIO, DigitalOcean) |
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
| `SERVICES_TO` | Recipient for service proposals | `services@dkpinnovation.com` | **Yes** |
| `CONTACT_TO` | Recipient for general inquiries | `info@dkpinnovation.com` | **Yes** |
| `STORAGE_PROVIDER` | Resume storage provider (`s3` or `local`) | `s3` | Yes |
| `OBJECT_STORAGE_REGION` | S3 Region | `us-east-1` | Yes (for S3) |
| `OBJECT_STORAGE_BUCKET` | Private S3 bucket name | `dkp-resumes-prod` | Yes (for S3) |
| `OBJECT_STORAGE_ACCESS_KEY` | S3 / R2 Access Key | `AKIAIOSFODNN7EXAMPLE` | Yes (for S3) |
| `OBJECT_STORAGE_SECRET_KEY` | S3 / R2 Secret Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | Yes (for S3) |
| `OBJECT_STORAGE_ENDPOINT` | Optional custom endpoint (for R2 / MinIO) | `https://<account-id>.r2.cloudflarestorage.com` | No |
| `SWAGGER_ENABLED` | Enable OpenAPI Swagger UI | `false` in prod | No |

---

## 4. Local Development Setup

### 1. Configure Local Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
For local testing without S3 or Neon, you can run with the `local` profile (uses embedded/fallback local resume storage at `./storage/resumes`).

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
4. Flyway automatically runs database migrations on startup from:
   `src/main/resources/db/migration/V1__init_schema.sql`
   Tables created:
   - `job_applications`
   - `service_enquiries`
   - `contact_submissions`
   - `email_outbox`

---

## 6. Resend Email Integration Setup

1. Sign up at [Resend](https://resend.com).
2. Add and verify your sending domain (e.g., `dkpinnovation.com`) by adding the DKIM/SPF TXT records to your DNS registrar.
3. In Resend Dashboard, go to **API Keys** -> **Create API Key** with sending access.
4. Set `RESEND_API_KEY=re_...` in your deployment environment variables.
5. Set `MAIL_FROM=DKP Innovations <noreply@dkpinnovation.com>`.

---

## 7. Private Resume Storage (S3 / Cloudflare R2)

1. Create a private S3 bucket (e.g. `dkp-resumes-private`).
2. **Disable Public Access**: Block all public access. The application accesses objects securely using IAM credentials.
3. Configure IAM user permissions with least privilege:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
         "Resource": "arn:aws:s3:::dkp-resumes-private/*"
       }
     ]
   }
   ```
4. Set `OBJECT_STORAGE_BUCKET`, `OBJECT_STORAGE_ACCESS_KEY`, and `OBJECT_STORAGE_SECRET_KEY`.

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

### Services Enquiry
- **Method**: `POST`
- **Path**: `/api/services/enquiries`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "fullName": "Aarav Patel",
    "email": "aarav@enterprise.com",
    "phone": "+91 98765 43210",
    "companyName": "Enterprise Solutions Ltd",
    "service": "IT & Digital Solutions",
    "message": "We require a scalable web infrastructure with automated inventory and CRM integration.",
    "privacyConsent": true
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "referenceId": "DKP-SRV-20261027-XYZ890",
    "message": "Thank you! Your project enquiry has been received...",
    "timestamp": "2026-10-27T13:40:00Z"
  }
  ```

### Contact Us Message
- **Method**: `POST`
- **Path**: `/api/contact`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "fullName": "Pooja Reddy",
    "email": "pooja@company.com",
    "phone": "+91 98450 11223",
    "service": "Website Design & Development",
    "message": "Interested in redesigning our customer portal and improving organic search visibility."
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "referenceId": "DKP-CNT-20261027-KLM456",
    "message": "Thank you! Your message has been received...",
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
4. In the Render dashboard, supply the secret environment variables (`DATABASE_URL`, `DATABASE_PASSWORD`, `RESEND_API_KEY`, `OBJECT_STORAGE_ACCESS_KEY`, etc.).
5. Click **Apply**.

### Option B: Manual Web Service Setup
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select your repository.
3. Configure:
   - **Environment**: Docker
   - **Docker Context**: `./dkp-backend`
   - **Dockerfile Path**: `./dkp-backend/Dockerfile`
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
- [x] **Path Traversal Protection**: Storage key is a random UUID; original filename is sanitized before storing metadata.
- [x] **Private Storage**: Objects stored with private ACLs; direct public URLs are never generated.
- [x] **Log Redaction**: Email addresses and telephone numbers are masked from logs via `DataMaskingConverter`.
- [x] **Rate Limiting**: Sliding token bucket enforces IP-based rate limiting on all public submission endpoints (HTTP 429 when exceeded).
- [x] **Honeypot Protection**: Anti-bot honeypot fields reject automated submissions.
- [x] **Generic Errors**: Internal database exceptions and stack traces are suppressed from client responses.
- [x] **Resilient Email Delivery**: Outbox scheduler retries transient failures with exponential backoff and jitter. Permanent failures (e.g. invalid recipient) are marked `PERMANENT_FAILURE` without blocking the database transaction.
- [x] **Container Security**: Multi-stage Docker build runs as unprivileged `appuser`.
