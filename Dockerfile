# Stage 1: Build
FROM node:23-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run docs:build

# Stage 2: Serve (nginx-unprivileged já roda como UID 101, sem root)
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
EXPOSE 8080