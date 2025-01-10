FROM node:21-alpine

RUN apk add --no-cache tzdata

# 타임존 설정


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
ENV TZ=Asia/Seoul
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:dev"]