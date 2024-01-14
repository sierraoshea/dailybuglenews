FROM node:20.9
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY stories.js .
CMD ["node", "stories.js"]
EXPOSE 3007