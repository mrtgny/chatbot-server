FROM alpine
RUN apk add --update nodejs npm
RUN npm i -g yarn
WORKDIR /usr/src/app/reactivers
COPY . .
RUN yarn
RUN npm run build
EXPOSE 8000

CMD  ["npm", "start"]