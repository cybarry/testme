# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .
COPY .env.local .env.local

ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://192.168.2.22:27017/testme?directConnection=true&serverSelectionTimeoutMS=5000&authSource=testme&appName=mongosh+2.5.9
ENV JWT_SECRET=your-secret-key-change-in-production
ENV NEXT_PUBLIC_WS_URL=ws://localhost:3000
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000

# Build Next.js application
RUN pnpm run build

# Runtime stage
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Set environment variables

# Copy package files from builder
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.local   ./.env
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
