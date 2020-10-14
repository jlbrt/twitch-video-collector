export const env = Object.freeze({
  targetTwitchChannel: process.env.TARGETTWICHCHANNEL as string,
  dbHost: process.env.DBHOST as string,
  dbPort: parseInt(process.env.DBPORT as string, 10),
  dbUser: process.env.DBUSER as string,
  dbPassword: process.env.DBPASSWORD as string,
  dbName: process.env.DBNAME as string,

  youtubeAuthToken: process.env.YOUTUBEAUTHTOKEN as string,

  twitchAuthClientId: process.env.TWITCHAUTHCLIENTID as string,
  twitchAuthUsername: process.env.TWITCHAUTHUSERNAME as string,
  twitchAuthOauthPassword: process.env.TWITCHAUTHOAUTHPASSWORD as string,
});
