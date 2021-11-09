FROM node:14-buster as base

RUN mkdir /app
WORKDIR /app
RUN chown -R node:node /app

USER node
COPY --chown=node:node ./ /app/
RUN yarn install
EXPOSE 3000

CMD ["node", "./server.js"]
