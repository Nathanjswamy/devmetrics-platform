# Base Image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root config files
COPY package.json package-lock.json ./
COPY tsconfig.json ./

# Copy API workspace
COPY apps/api ./apps/api

# Install dependencies (workspaces support)
RUN npm install

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build API
RUN npm run build

# Production Image
FROM node:18-alpine AS production

WORKDIR /app

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
