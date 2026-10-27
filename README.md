# DKP Innovation — Official Platform

Official website and digital presence platform for DKP Innovation, built with a modern React 19 frontend and a production-ready Spring Boot 3.4 Java backend.

## Project Structure

```
dkp/
├── frontend/                # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── public/              # Static assets (images, icons, founder photo)
│   ├── src/
│   │   ├── components/      # UI components, pages (Home, About, Services, Careers, Contact)
│   │   ├── services/        # Centralized API client, careers, contact services
│   │   ├── context/         # Application state and navigation context
│   │   ├── data/            # Authoritative service and company data
│   │   └── hooks/           # Interaction & animation hooks
│   └── package.json
├── dkp-backend/             # Java 21 + Spring Boot 3.4 Production Backend
│   ├── src/main/java/com/dkp/
│   │   ├── careers/         # Career application submission & resume storage
│   │   ├── services/        # Service enquiry & catalogue validation
│   │   ├── contact/         # Contact Us form processing
│   │   ├── email/           # Resend API & Transactional Outbox pattern
│   │   ├── storage/         # S3 & local resume storage abstraction
│   │   ├── security/        # IP Rate limiting & spam protection
│   │   └── common/          # Standardized API response, error handler, MDC logging
│   ├── src/main/resources/  # application.yml & Flyway PostgreSQL migrations
│   ├── Dockerfile           # Multi-stage production container
│   ├── pom.xml              # Maven dependencies & build configuration
│   └── README.md            # Detailed backend & Render deployment documentation
├── render.yaml              # Render infrastructure blueprint
└── README.md
```

## Getting Started

### 1. Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Development

```bash
cd dkp-backend
./mvnw clean test
./mvnw spring-boot:run
```

For detailed backend configuration, Neon PostgreSQL setup, Resend credentials, and Render deployment, see [`dkp-backend/README.md`](file:///c:/dkp-projects/dkp/dkp-backend/README.md).
