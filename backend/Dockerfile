# ==============================================================================
# DKP Innovations Backend — Multi-Stage Production Dockerfile
# Base Image: Eclipse Temurin OpenJDK 21 LTS
# ==============================================================================

# Stage 1: Build & Package
FROM maven:3.9.11-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compile and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create storage directory for local fallback if needed
RUN mkdir -p /app/storage/resumes && chown -R appuser:appgroup /app/storage

# Copy fat jar from builder
COPY --from=builder /app/target/dkp-backend-1.0.0.jar app.jar
RUN chown appuser:appgroup app.jar

# Switch to non-root user
USER appuser

# Expose default HTTP port
EXPOSE 8080

# Environment variables with safe defaults
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/actuator/health || exit 1

# Launch application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
