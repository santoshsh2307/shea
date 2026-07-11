# Root Dockerfile for the shea (enterprise-ui) React application.
# Builds the React app with Node.js and serves the static build with Nginx.

# ---------- Build stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching
COPY enterprise-ui/package*.json ./
RUN npm install

# Copy the rest of the frontend source and build
COPY enterprise-ui/ ./
RUN npm run build

# ---------- Production stage ----------
FROM nginx:alpine

# Custom nginx config that serves the SPA on port 80 with client-side routing support
COPY nginx.react.conf /etc/nginx/conf.d/default.conf

# Copy the production build output from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
