import { dbConnection } from '../src/DAO/db';

(async () => {
  try {
    await dbConnection.raw('TRUNCATE "public"."videos" CASCADE;');

    console.log('DB clear successful');
    process.exit(0);
  } catch (err) {
    console.error('DB clear failed', err);
    process.exit(1);
  }
})();
