FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

CMD [ "node", "bot.js" ]
