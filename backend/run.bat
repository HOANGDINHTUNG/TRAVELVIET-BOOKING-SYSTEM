@echo off
echo Starting TravelViet Backend...
REM Force dev profile so datasource/application-dev.yaml is loaded
REM After DB/refactor, avoid stale target/classes causing NoClassDefFoundError
.\mvnw.cmd clean spring-boot:run -Dmaven.test.skip=true -Dspring-boot.run.profiles=dev
