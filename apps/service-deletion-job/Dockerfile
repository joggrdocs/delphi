FROM node:20-bookworm as base
RUN mkdir /app
WORKDIR /app
RUN chown -R node:node /app

USER node
FROM base as build
COPY --chown=node:node ./ /app/
RUN yarn install --immutable --immutable-cache
RUN yarn build

FROM base as web
USER node
COPY --chown=node:node --from=build /app/ /app/
EXPOSE 8080
CMD ["node", "index.js"]
