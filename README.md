### GRAND Stack Kit
This is a full stack boilerplate currently in development!
It's stack is a little more nuanced than standard GRAND so here's a list of all the technologies used:
- [GraphQL](https://graphql.org)
- [Preact](https://preactjs.com) - a faster, lighter version of React; uses [preact/compat](https://preactjs.com/guide/v10/switching-to-preact) so your source code still refers to regular old React
- [Apollo](https://www.apollographql.com)
- [NodeJS](https://nodejs.org)
- [TypeScript](https://www.typescriptlang.org) - used in frontend and backends
- [Neo4j](https://neo4j.com)
- [@tlowerison/neo4j-graphql-js](https://github.com/tlowerison/neo4j-graphql-js) - a fork of neo4j-graphql-js which provides dynamic authorization capabilities
- [Kubernetes](https://kubernetes.io)
- [Docker](https://www.docker.com) - use [Docker Desktop](https://www.docker.com/products/docker-desktop) for building images locally
- [Redis](https://docs.redislabs.com/latest/rs/references/client_references/client_nodejs)
- [nginx](https://www.nginx.com)
- Your pick of a Kubernetes Cloud Provider
  - There are a lot of great options out there, our goal is to make our k8s configuration as loosely coupled to the cloud provider as possible. We should be able to switch providers with as little as friction as possible!
  - I personally use [Digital Ocean](https://www.digitalocean.com). It provides Kubernetes clusters as well as private image repositories for pretty reasonable prices, plus it has a lot of great in depth blog posts which I leaned on heavily while making this

The basic architecture works as follows:
- Kubernetes/nginx routes traffic to different services based on path
  - (Prefix): grandstack-kit.com/ -> client
  - (Exact): grandstack-kit.com/graphql -> server
  - (Exact): grandstack-kit.com/api -> api
- The api and the server are separated into different services primarily for separation of interests
  - Server:
    - cookie based session management (uses Redis)
    - domain filtering
    - special operations that shouldn't be accessible through API directly (i.e. user sign up)
  - API:
    - JWT authorization
    - Direct link to Neo4J database
    - External facing due to decoupling from server
  - [Eat your own dogfood](https://en.wikipedia.org/wiki/Eating_your_own_dog_food):
    - Server uses a direct (internal link to the) api so that your platform is held accountable to providing the same capabilities to your API users as your website

##### Installation
```
git clone https://github.com/tlowerison/grandstack-kit.git
cd grandstack-kit
rm -rf .git && git init
cd scripts
chmod u+x build-image.sh
chmod u+x publish-image.sh
chmod u+x start-image.sh
chmod u+x yield-image.sh
cd ..
cd server
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
cd ../..
```