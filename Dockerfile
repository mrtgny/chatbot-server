FROM node:10

WORKDIR /usr/src/app/mrtgny

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
