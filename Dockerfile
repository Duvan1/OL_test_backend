# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY . .

RUN rm -rf node_modules && npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npx prisma generate
RUN npm run build

RUN rm -rf node_modules && npm install --omit=dev --legacy-peer-deps

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

RUN chmod +x ./scripts/init-db.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "./scripts/init-db.sh && node dist/main"]
