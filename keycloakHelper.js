const Keycloak = require("keycloak-js");

const options = {
  url: `${process.env.APP_AUTH_SERVER_URL}`,
  realm: `${process.env.APP_REALM}`,
  clientId: `${process.env.APP_CLIENT_ID}`,
};

const KEYCLOAK_ERROR = "Keycloak Error";

const fetchToken = async () => {
  const keycloak = Keycloak(options);
  return keycloak
    .init({ onLoad: "login-required" })
    .then(() => {
      return keycloak;
    })
    .catch(() => {
      return KEYCLOAK_ERROR;
    });
};

module.exports = {
  fetchToken,
};
