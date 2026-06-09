# Base Image
FROM node:20-alpine AS builder

# Install build tools for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy the entire monorepo to support npm workspaces during install
COPY . .

# Install dependencies (workspaces support)
RUN apk add --no-cache openssl
RUN npm install

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build API
RUN npm run build

# Production Image
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

# Copy built artifacts and necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

# Install only production dependencies
# RUN npm ci --omit=dev

EXPOSE 4000

# Start command
CMD ["node", "dist/main.js"]
