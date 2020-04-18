FROM node:13

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

WORKDIR ./dist

EXPOSE 3000

CMD node src/index.js