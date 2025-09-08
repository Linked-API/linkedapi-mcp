FROM node:20-slim AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts

FROM node:20-slim AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev)
RUN HUSKY=0 npm ci --legacy-peer-deps

# Copy sources and build
COPY tsconfig.json ./
COPY src ./src
COPY README.md ./README.md
RUN npm run build

FROM node:20-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy production node_modules and built app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV HOST=0.0.0.0 \
    PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js", "--http"]
