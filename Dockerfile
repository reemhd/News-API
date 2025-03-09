FROM node:22-slim

WORKDIR /srv

COPY . .

RUN npm install --omit=dev

CMD ["node", "listen.js"]