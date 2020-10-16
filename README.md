# Twitch Video Collector

## Getting Started

1. get Twtich oAuth Token from `https://twitchapps.com/tmi/`
2. get YouTube API Key from `https://console.developers.google.com/apis/credentials`
3. copy `.env.sample` -> `.env` and fill out values
4. run `npm install`
5. run `docker-compose up -d`
6. run `docker-compose exec app npm run db:migrate:dev`
