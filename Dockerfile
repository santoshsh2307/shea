FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy maven files first to leverage Docker cache
COPY enterprise-backend/pom.xml ./
COPY enterprise-backend/settings.xml ./ || true

# Copy source and build
COPY enterprise-backend/src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy jar from build stage
COPY --from=build /workspace/target/*.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher -version || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
