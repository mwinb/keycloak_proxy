## Keycloak Proxy

Forward keycloak token in Authorization header in order to simulate JWT Forwarding in Cluster locally for development.

## Docker Hub

mwinberry/keycloak_proxy

## When to use.

Authorization is being handled in service mesh, with keycloak, for deployment and that service mesh forwards a jwt in the authorization header for example: `Authorization: Bearer {token}`. This application does not refresh the token as the expectation is that the service mesh is handling all authentication and security prior to any request being sent to the front end or back end.

## Suggested Use.

Create docker compose file with both keycloak (which ingests your realm and client settings) and this application to ensure keycloak is up and running.

Use the `/login` url to initialize a user session with keycloak. This url will redirect you back to your front end application after successful authentication. Set your log out functionality in your front end to link to the auth logout url as env variable that can be changed in production to match your service mesh logout url.

## Application Urls.

`POST /setToken`  
`GET /login`  
`GET /logout`  
`GET /`  
 Adjust as neccessary to prevent conflicts with backend endpoints.

## Env Variables

These will be set in your docker file.

### APP_AUTH_SERVER_URL

Your keycloak auth url ends with /auth.

### KEY_CLOAK_URL

The url for your local keycloak instance.  
Ensure keycloak is set to accept redirect urls from the running host port 8000.

### APP_REALM

The keycloak realm.

### APP_CLIENT_ID

The keycloak Client Id

### FRONT_END_URL

Font end url. Ensure all requests from front end are sent to this applications url at port 8000 in order for jwt to be added prior to the request being sent to backend. Suggest env variable in front end that can be changed for production containers.

### BACK_END_URL

The url for requests to be proxied to. Ensure this is replaced with your machine ip address if you are running this application in docker container and your back end is running locally outside of container.
