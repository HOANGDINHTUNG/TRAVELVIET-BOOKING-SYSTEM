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
# Tránh lỗi kết nối IPv6 trên một số PaaS (Render). Nếu TCP/DNS lỗi, thử bỏ biến này trên Render.
ENV JAVA_TOOL_OPTIONS="-Djava.net.preferIPv4Stack=true"

CMD ["java", "-jar", "app.jar"]
