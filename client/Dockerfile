FROM node:12-alpine AS BUILD_IMAGE

  WORKDIR /usr/src/app

  COPY .npmrc.docker .npmrc
  COPY dependencies.json package.json
  COPY yarn.lock ./
  RUN yarn

  COPY .babelrc package.json tsconfig.json webpack.config.js ./
  COPY public ./public
  COPY src ./src
  RUN yarn build

FROM nginx:1.17-alpine

  RUN apk --no-cache add curl

  RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
      chmod +x envsubst && \
      mv envsubst /usr/local/bin

  COPY nginx /etc/nginx

  CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

  COPY --from=BUILD_IMAGE /usr/src/app/dist /usr/share/nginx/html
