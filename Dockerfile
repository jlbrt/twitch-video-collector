# Build
FROM node:16.13-alpine as build

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

# Production Environment
FROM node:16.13-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY ./package.json ./package.json
RUN npm install --production

COPY --from=build /usr/src/app/dist /usr/src/app/dist

EXPOSE 3000
CMD [ "npm", "run", "start" ]
