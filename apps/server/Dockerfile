FROM node:20-alpine AS builder

WORKDIR /app

COPY apps/server/package*.json ./
RUN npm install

COPY apps/server ./
RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY apps/server/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
