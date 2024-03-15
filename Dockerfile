FROM node:16-alpine as build-frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM maven:3.8.4-openjdk-17 as build-spring-boot
WORKDIR /backend
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
COPY src/ src/
COPY --from=build-frontend /app/build /backend/src/main/resources/static
RUN ./mvnw package


FROM openjdk:17-jdk-slim
COPY --from=build-spring-boot /backend/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]