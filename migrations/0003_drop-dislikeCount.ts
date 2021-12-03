import Knex from 'knex';

export const up = async (dbConnection: Knex): Promise<void> => {
  await dbConnection.schema.table('videos', (table) => {
    table.dropColumn('dislikeCount');
  });
};

export const down = async (dbConnection: Knex): Promise<void> => {
  throw new Error();
};
