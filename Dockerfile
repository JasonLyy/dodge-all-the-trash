FROM node:13

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# credentials are required in dist/src for code to work. recopy config.json as workaround to do conditional copy (if credentials no exist)
COPY ./src/config.json ./src/credentials.json* ./dist/src/

WORKDIR ./dist

EXPOSE 3000

CMD node src/index.js