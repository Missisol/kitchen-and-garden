# https://docs.docker.com/guides/vuejs/containerize/
ARG NODE_VERSION=23.11.0-alpine
ARG NGINX_VERSION=alpine3.22

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy application code
COPY . .

# Build for production
# Use empty string for relative URLs since nginx will proxy API requests
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# Production stage
# FROM nginx:alpine
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Use a built-in non-root user for security best practices
USER nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
# COPY --from=builder /app/dist /usr/share/nginx/html
# Copy the static build output from the build stage to Nginx's default HTML serving directory
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 8080
# EXPOSE 5173

# Start nginx
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
# CMD ["nginx", "-g", "daemon off;"]
# Start Nginx directly with custom config
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
