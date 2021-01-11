# GRAND Stack Kit
This is a full stack boilerplate currently in development!
It's stack is a little more nuanced than standard GRAND so here's a list of all the technologies used:
- [GraphQL](https://graphql.org)
- [Preact](https://preactjs.com) - a faster, lighter version of React; with [preact/compat](https://preactjs.com/guide/v10/switching-to-preact) your source code still refers to regular old React
- [Apollo](https://www.apollographql.com)
- [NodeJS](https://nodejs.org)
- [TypeScript](https://www.typescriptlang.org) - used in frontend and backends
- [Neo4j](https://neo4j.com)
- [@tlowerison/neo4j-graphql-js](https://www.npmjs.com/package/@tlowerison/neo4j-graphql-js) - a fork of neo4j-graphql-js which provides dynamic authorization capabilities
- [Kubernetes](https://kubernetes.io)
- [Docker](https://www.docker.com) - use [Docker Desktop](https://www.docker.com/products/docker-desktop) for building images locally
- [Redis](https://docs.redislabs.com/latest/rs/references/client_references/client_nodejs)
- [nginx](https://www.nginx.com)
- (optional) [cygoose](https://github.com/tlowerison/cygoose/) - a Neo4j database migration tool
- Your pick of a Kubernetes Cloud Provider
  - There are a lot of great options out there, our goal is to make our k8s configuration as loosely coupled to the cloud provider as possible. We should be able to switch providers with as little as friction as possible!
  - I personally use [Digital Ocean](https://www.digitalocean.com). It provides Kubernetes clusters as well as private image repositories for pretty reasonable prices, plus it has a lot of great in depth blog posts which I leaned on heavily while making this

The basic architecture works as follows:
- Kubernetes/nginx routes traffic to different services based on path
  - (Prefix): domain.com/ -> client
  - (Exact): domain.com/graphql -> server
  - (Exact): domain.com/api -> api
- The api and the server are separated into different services that way we [eat our own dogfood](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) (also, great read about it https://gist.github.com/chitchcock/1281611):
  - Server:
    - cookie based session management (uses Redis)
    - domain filtering
    - special operations that shouldn't be accessible through API directly (i.e. user sign up)
  - API:
    - JWT authorization
    - Direct link to Neo4J database
    - External facing due to decoupling from server

### Installation
```
git clone https://github.com/tlowerison/grandstack-kit.git
bash grandstack-kit/install.sh [-p PROJECT_NAME] [-d DOMAIN] [-i IMAGE_REPO]
```
E.g.
```
bash grandstack-kit/install.sh -p my-cool-project -d mydomain.com -i myimagerepo
```
Installation includes three separate instances of `yarn && yarn build` so if you like watching paint dry feel free to watch, otherwise here are some sweet time-burners
- https://tixy.land/
- https://paveldogreat.github.io/WebGL-Fluid-Simulation/
- https://youtu.be/mev2cgRN9Zo
- https://youtu.be/yY9GAyJtuJ0
