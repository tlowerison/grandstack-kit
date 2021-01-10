# API
Make sure to add a .env file in this directory that has these environemnt variables
```
API_KEY_SECRET='a-lot-of-random-letters-and-numbers-here'
GRAPHQL_PATH=/api
JWT_SECRET='32-random-numbers-letter-and-symbols-here'
NEO4J_HOST=localhost
NEO4J_PASSWORD='neo4j-password-here'
NEO4J_PORT=7687
NEO4J_PROTOCOL=bolt
NEO4J_USERNAME=neo4j
NODE_ENV=development
PORT=8080
```
Also, make sure that the value assigned to `JWT_SECRET` is the same as the one assigned to `JWT_SECRET` in server/.env
