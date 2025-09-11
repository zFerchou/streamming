FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

# Usar nodemon para desarrollo o node con flags de debugging
CMD ["node", "--unhandled-rejections=strict", "server.js"]