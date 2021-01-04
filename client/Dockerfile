FROM node:12-alpine AS BUILD_IMAGE

  WORKDIR /usr/src/app

  # COPY .npmrc .npmrc
  COPY package.json yarn.lock ./
  RUN yarn
  COPY .babelrc tsconfig.json webpack.config.js ./
  COPY public ./public
  COPY src ./src
  RUN yarn build

FROM nginx:1.17-alpine

  COPY --from=BUILD_IMAGE /usr/src/app/dist /usr/share/nginx/html
  COPY nginx /etc/nginx
