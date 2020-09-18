FROM node:12.2.0

WORKDIR /

COPY package.json package-lock.json ./

ENV HOME_URL=/
ENV LOGIN_URL=/login
ENV LOGOUT_URL=/logout
ENV SET_TOKEN_URL=/setToken
ENV APP_AUTH_SERVER_URL=http://localhost:8080/auth
ENV KEY_CLOAK_URL=http://localhost:8080
ENV APP_REALM=Your_Keycloak_Realm
ENV APP_CLIENT_ID=Your_Keycloak_Client
ENV FRONT_END_URL=http://localhost:3000
ENV BACK_END_URL=http://localhost:4000


RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "index.js"]