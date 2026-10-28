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

# Environment variables with safe defaults (binding to 0.0.0.0 for Render port detection)
ENV PORT=8080 \
    SERVER_PORT=8080 \
    SERVER_ADDRESS=0.0.0.0 \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT:-8080}/actuator/health || exit 1

# Launch application with explicit 0.0.0.0 host binding and dynamic port configuration
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar --server.port=${PORT:-8080} --server.address=0.0.0.0"]
