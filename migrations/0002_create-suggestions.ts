import { Knex } from 'knex';

export const up = async (dbConnection: Knex): Promise<void> => {
  await dbConnection.schema.createTable('suggestions', (table) => {
    table.increments();

    table.integer('videoId').notNullable();
    table.foreign('videoId').references('videos.id');

    table.string('username').notNullable();

    table
      .timestamp('lastSuggestedAt')
      .notNullable()
      .defaultTo(dbConnection.fn.now());
  });
};

export const down = async (dbConnection: Knex): Promise<void> => {
  await dbConnection.schema.dropTable('suggestions');
};
