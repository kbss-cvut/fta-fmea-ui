FROM node:16-alpine AS BASE
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

CMD ["npm", "start"]