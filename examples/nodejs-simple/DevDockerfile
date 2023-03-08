FROM node:14-buster as base

RUN mkdir /app
WORKDIR /app
RUN chown -R node:node /app

ARG BUILD_VAR=not_set
ARG BUILD_VAR2=not_set

RUN echo "$BUILD_VAR"
RUN echo "$BUILD_VAR2"

USER node
COPY --chown=node:node ./ /app/
RUN yarn install
EXPOSE 3000

CMD ["node", "./server.js"]
