FROM alpine as base
RUN apk add --update nodejs npm
ENV NODE_ENV=production

FROM base as build
RUN npm i -g yarn
WORKDIR /usr/src/build/reactivers
COPY . .
RUN yarn install --production --frozen-lockfile --network-timeout 100000
RUN yarn global add typescript
RUN npm run build
RUN yarn global remove typescript

FROM base as prod
WORKDIR /usr/src/app/reactivers
COPY --from=build /usr/src/build/reactivers/node_modules/ ./node_modules/
COPY --from=build /usr/src/build/reactivers/dist/ ./dist/
COPY --from=build /usr/src/build/reactivers/package.json .
EXPOSE 8000

CMD  ["npm", "run", "start"]