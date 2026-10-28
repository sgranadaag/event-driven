# Build: every dependency, compiled into one bundle by the Nest CLI (rspack).
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run: production dependencies and the bundle only. Configuration arrives as
# environment variables and is never baked into the image. Nothing is
# exposed: a consumer only opens a connection to RabbitMQ, so any number of
# them can run side by side.
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main"]
