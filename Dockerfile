FROM docker.io/library/node:22.14.0-alpine3.21 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# El config de Decap de producción (backend gitea) pisa al de dev (proxy/decap-server)
RUN cp decap-config.prod.yml public/admin/config.yml && npm run build

FROM docker.io/library/nginx:1.27.4-alpine
COPY --from=build /app/dist /usr/share/nginx/html
