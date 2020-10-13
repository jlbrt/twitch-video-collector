import path from 'path';
import { dbConnection } from '../src/dao/db';

(async () => {
  try {
    await dbConnection.migrate.latest({
      directory: path.join(__dirname, '../migrations'),
    });

    console.log('migrations successful');
    process.exit(0);
  } catch (err) {
    console.error('migrations failed', err);
    process.exit(1);
  }
})();
