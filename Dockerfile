FROM node:22 AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN ls -la src/modules/prisma

RUN apt-get update -y && apt-get install -y openssl

RUN npx prisma generate

RUN npx tsc


FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/modules/prisma ./src/modules/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma


ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]