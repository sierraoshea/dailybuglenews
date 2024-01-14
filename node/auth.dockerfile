FROM node:20.9
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY auth.js .
CMD ["node", "auth.js"]
EXPOSE 3006