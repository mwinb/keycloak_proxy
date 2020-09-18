require("dotenv").config();
const httpProxy = require("http-proxy");
const http = require("http");
const bodyParser = require("body-parser");
const app = require("express")();
const fs = require("fs");
const apiProxy = httpProxy.createProxyServer({ ws: true });
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));

const runningPort = 8000;
const backEndUrl = `${process.env.BACK_END_URL}`;
const frontEndUrl = `${process.env.FRONT_END_URL}`;
const loginUrl = `${process.env.LOGIN_URL}`;
const logoutUrl = `${process.env.LOGOUT_URL}`;
const homeUrl = `${process.env.HOME_URL}`;
const setTokenUrl = `${process.env.SET_TOKEN_URL}`;

let token = undefined;

app.get(homeUrl, (_req, res) => {
  const valueMap = {
    runningPort: runningPort,
    keycloakUrl: `${process.env.APP_AUTH_SERVER_URL}`,
    frontEndUrl: frontEndUrl,
    backEndUrl: backEndUrl,
    loginUrl: loginUrl,
    logoutUrl: logoutUrl,
  };
  res.send(replaceValuesInHtml(valueMap, "/home.html"));
});

app.post(setTokenUrl, (req, res) => {
  try {
    token = req.headers.authorization.split(" ")[1];
    res.sendStatus(200);
  } catch {
    res.sendStatus(400);
  }
});

app.get("/keycloakJs/keycloak.js", (_req, res) => {
  res.sendFile(__dirname + "/keycloakJs/keycloak.js");
});

app.get(loginUrl, (_req, res) => {
  res.status(200).send(getLoginPage());
});

app.get(logoutUrl, (_req, res) => {
  try {
    token = undefined;
  } catch {
    console.log("No token to Remove.");
  }
  const valueMap = {
    newUrl: `http://localhost:${runningPort}/login`,
    realm: `${process.env.APP_REALM}`,
    authUrl: `${process.env.APP_AUTH_SERVER_URL}`,
  };

  const html = replaceValuesInHtml(valueMap, "/logout.html");
  res.send(html);
});

app.all("/*", (req, res) => {
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
    apiProxy.web(req, res, { target: backEndUrl });
  } else {
    console.log("Not Logged In");
  }
});

app.on("upgrade", (req, socket, head) => {
  apiProxy.ws(req, socket, head);
});

server.listen(runningPort);

function getLoginPage() {
  const valueMap = {
    url: `"${process.env.APP_AUTH_SERVER_URL}"`,
    realm: `"${process.env.APP_REALM}"`,
    clientId: `"${process.env.APP_CLIENT_ID}"`,
    newUrl: `"${frontEndUrl}"`,
    setTokenUrl: setTokenUrl,
  };

  const html = replaceValuesInHtml(valueMap, "/login.html");
  return html;
}

function replaceValuesInHtml(valueMap, htmlPath) {
  let fileAsString = fs.readFileSync(__dirname + `${htmlPath}`, "utf8");
  for (let key in valueMap) {
    fileAsString = fileAsString.split(`!{ ${key} }`).join(valueMap[key]);
  }
  return fileAsString;
}
