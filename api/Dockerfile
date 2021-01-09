FROM node:12-alpine AS BUILD_IMAGE

  RUN apk add rsync

  WORKDIR /usr/src/app

  COPY .npmrc.docker .npmrc
  COPY dependencies.json package.json
  COPY yarn.lock ./
  RUN yarn

  COPY .babelrc package.json tsconfig.json webpack.config.js ./
  COPY src ./src
  RUN yarn build

  RUN npm prune --production

FROM node:12-alpine

  WORKDIR /usr/src/app

  COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
  COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

  EXPOSE 5050

  CMD ["node", "dist/main.js"]
