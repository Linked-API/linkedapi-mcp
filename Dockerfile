FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY README.md ./README.md
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0 \
    PORT=3000 \
    MCP_HTTP_PATH=/mcp

EXPOSE 3000

CMD ["node", "dist/index.js", "--http"]


