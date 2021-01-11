# GRAND Stack Kit
This is a [GRAND Stack](https://grandstack.io/) boilerplate currently in development! Because it's goal is to be production ready, there are a few more dependencies than standard GRAND, so here's a list of all the technologies used:
- [GraphQL](https://graphql.org)
- [Preact](https://preactjs.com) - a faster, lighter version of React; with [preact/compat](https://preactjs.com/guide/v10/switching-to-preact) your source code still refers to regular old React
- [Apollo](https://www.apollographql.com)
- [@tlowerison/neo4j-graphql-js](https://www.npmjs.com/package/@tlowerison/neo4j-graphql-js) - a fork of neo4j-graphql-js which provides dynamic authorization capabilities
- [TypeScript](https://www.typescriptlang.org) - used in both frontend and backend
- [Neo4j Database](https://neo4j.com)
- [Redis](https://docs.redislabs.com/latest/rs/references/client_references/client_nodejs) - for session management
- [Docker](https://www.docker.com) - use [Docker Desktop](https://www.docker.com/products/docker-desktop) for building images locally
- [Kubernetes](https://kubernetes.io)
- [nginx](https://www.nginx.com)
- (optional) [cygoose](https://github.com/tlowerison/cygoose/) - a Neo4j database migration tool
- Your pick of a Kubernetes Cloud Provider
  - I personally use [Digital Ocean](https://www.digitalocean.com), they provide Kubernetes clusters as well as private image repositories for pretty reasonable prices. They also have plenty of in-depth walkthroughs which I leaned on heavily while making this

The basic architecture works as follows:
- Kubernetes/nginx routes traffic to different services based on path
  - (Prefix): domain.com/ -> client
  - (Exact): domain.com/graphql -> server
  - (Exact): domain.com/api -> api
- The api and the server are separated into different services to make sure we [eat our own dogfood](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) (here's a great read for more about that https://gist.github.com/chitchcock/1281611):
  - Server:
    - cookie based session management
    - domain filtering
    - special operations that shouldn't be accessible through API directly (i.e. sign-up / sign-in / sign-out)
  - API:
    - JWT authorization
    - Direct link to Neo4J database
    - External facing thanks to decoupling from server

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
- https://youtu.be/yY9GAyJtuJ0

### Usage
Run all of these commands in separate tabs

Start Redis
```
cd redis-stable
redis-server
```

Start API
```
cd api
yarn start
```

Start Server
```
cd api
yarn start
```

Start Client
```
cd api
yarn start
```
