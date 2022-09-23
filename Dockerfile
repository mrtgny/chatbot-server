FROM alpine as base
RUN apk add --update nodejs npm
RUN npm i -g yarn

FROM base as build
WORKDIR /usr/src/build/reactivers
COPY . .
RUN yarn install --frozen-lockfile --network-timeout 100000
RUN npm run build

FROM base as prod
WORKDIR /usr/src/app/reactivers
COPY --from=build /usr/src/build/reactivers/node_modules/ ./node_modules/
COPY --from=build /usr/src/build/reactivers/dist/ ./dist/
COPY --from=build /usr/src/build/reactivers/package.json .
EXPOSE 8000

CMD  ["npm", "start"]