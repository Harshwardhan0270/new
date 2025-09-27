# Multi-stage build for production deployment
FROM node:18-alpine as backend-build

# Set working directory for backend
WORKDIR /app/server

# Copy backend package files
COPY server/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source code
COPY server/ ./

# Frontend build stage
FROM node:18-alpine as frontend-build

# Set working directory for frontend
WORKDIR /app/client

# Copy frontend package files
COPY client/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY client/ ./

# Build frontend for production
RUN npm run build

# Production stage
FROM node:18-alpine as production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy backend from backend-build stage
COPY --from=backend-build --chown=nodejs:nodejs /app/server ./server

# Copy frontend build from frontend-build stage
COPY --from=frontend-build --chown=nodejs:nodejs /app/client/build ./client/build

# Create uploads directory
RUN mkdir -p /app/server/uploads && chown -R nodejs:nodejs /app/server/uploads

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/healthcheck.js

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/server.js"]