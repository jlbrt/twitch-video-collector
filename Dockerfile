# Build
FROM node:14 as build

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

# Production Environment
FROM node:14

WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY ./package.json ./package.json
RUN npm install --production

COPY --from=build /usr/src/app/dist /usr/src/app/dist

EXPOSE 3000
CMD [ "npm", "run", "start" ]
