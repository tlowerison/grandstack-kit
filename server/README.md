# Server
Make sure to add a .env file in this directory that has these environemnt variables
```
API_GRAPHQL_PATH=/api
API_HOST=localhost
API_PORT=5050
API_PROTOCOL=http
CLIENT_PORT=3000
DOMAIN=domain.com
GRAPHQL_PATH=/graphql
JWT_SECRET='32-random-numbers-letter-and-symbols-here'
NODE_ENV=development
PORT=7070
REDIS_HOST=localhost
REDIS_PORT=6379
SESSION_SECRET='a-lot-of-random-letters-and-numbers-here'
```
Also, make sure that the value assigned to `JWT_SECRET` is the same as the one assigned to `JWT_SECRET` in api/.env

Make sure that redis is running, by running in `server`'s parent directory
```
cd ../redis-stable
redis-server
```
as well as the API
```
cd ../api
yarn start
```
