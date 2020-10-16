FROM node:12.18.4-alpine3.10

WORKDIR /usr/src/app

COPY package.json package-lock*.json /usr/src/app/

RUN apk add python3
RUN apk add build-base

RUN npm install node-gyp

RUN npm install && npm cache clear --force

COPY . /usr/src/app/

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
