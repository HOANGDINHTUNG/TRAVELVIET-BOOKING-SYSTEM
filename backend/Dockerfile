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
# Render free tier 512MB: heap+metaspace+native phải < 512MB (MaxRAMPercentage=75% từng gây OOM kill im lặng)
ENV JAVA_TOOL_OPTIONS="-Xmx256m -Xms128m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"

CMD ["java", "-jar", "app.jar"]
