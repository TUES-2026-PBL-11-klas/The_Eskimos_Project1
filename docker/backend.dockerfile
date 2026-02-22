# Stage 1: Dependencies 

FROM node:20-alpine AS deps

RUN apk add --no-cache openssl

WORKDIR /app

# Copy only manifests first for layer caching
COPY backend/package*.json ./

# Install all deps (including devDependencies for Prisma CLI)
RUN npm install

# Generate Prisma client inside the container
COPY backend/prisma ./prisma
RUN npx prisma generate

# Stage 2: Production image 
FROM node:20-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

# Copy node_modules and generated Prisma client from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy application source
COPY backend/src ./src
COPY backend/package*.json ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
