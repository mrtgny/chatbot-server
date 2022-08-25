FROM node:16-alpine

WORKDIR /usr/src/app/mrtgny

COPY . .

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
