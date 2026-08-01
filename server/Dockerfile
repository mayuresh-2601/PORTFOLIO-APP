FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Replaced npm ci with npm install --omit=dev
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]