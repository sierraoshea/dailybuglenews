FROM node:20.9
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ads.js .
CMD ["node", "ads.js"]
EXPOSE 3008