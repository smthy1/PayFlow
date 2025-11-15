FROM node:22 AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .


RUN npx prisma generate --schema=src/modules/prisma/schema.prisma

RUN npx tsc


FROM node:22 AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/modules/prisma ./src/modules/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma


EXPOSE 3000

CMD ["node", "dist/server.js"]