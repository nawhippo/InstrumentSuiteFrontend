FROM node:16-alpine as build-node

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --verbose && ls -la build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=build-node /app/build .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]