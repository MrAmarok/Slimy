FROM node:20.10.0-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

COPY --chown=appuser:appgroup package*.json ./

RUN npm install

COPY --chown=appuser:appgroup . .

RUN npm run build

CMD ["npm", "run", "start"]
