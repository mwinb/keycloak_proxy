FROM node:12.2.0

WORKDIR /

COPY package.json package-lock.json ./

ENV APP_AUTH_SERVER_URL=http://localhost:8080/auth
ENV KEY_CLOAK_URL=http://localhost:8080
ENV APP_REALM=MY_REALM
ENV APP_CLIENT_ID=MY_CLIENT_ID
ENV FRONT_END_URL=http://localhost:3000
ENV BACK_END_URL=http://localhost:4000


RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "index.js"]