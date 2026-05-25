# Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
# -Dmaven.test.skip=true: bỏ compile test (Render); -DskipTests vẫn compile test → dễ fail CI
RUN mvn clean package -Dmaven.test.skip=true

# Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
# Chứng chỉ Aiven: đặt backend/ca.pem (cùng cấp Dockerfile)
COPY ca.pem ./ca.pem

ENV SPRING_PROFILES_ACTIVE=prod
# Render free 512MB: ~256m heap + ~140m metaspace (96m metaspace → OOM khi load Hibernate/QueryDSL)
ENV JAVA_TOOL_OPTIONS="-Xmx256m -Xms128m -XX:MaxMetaspaceSize=140m -XX:ReservedCodeCacheSize=48m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"

CMD ["java", "-jar", "app.jar"]
