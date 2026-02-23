# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN npm install -g npm@11.10.1
WORKDIR /app
COPY frontend/package*.json ./
RUN --mount=type=cache,id=npm-frontend,target=/root/.npm \
    npm install

# Stage 2: Build 
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
# API_URL is used at build time by next.config.mjs rewrites
ARG API_URL=http://backend:3001
ENV API_URL=$API_URL
RUN npm run build

# Stage 3: Production 
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
# next build --output standalone copies everything needed here
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static     ./.next/static
COPY --from=builder /app/public           ./public
EXPOSE 3000
CMD ["node", "server.js"]
