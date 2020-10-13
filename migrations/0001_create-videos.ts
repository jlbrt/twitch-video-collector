import Knex from 'knex';

export const up = async (dbConnection: Knex): Promise<void> => {
  await dbConnection.schema.createTable('videos', (table) => {
    table.increments();

    table.string('youtubeId').notNullable().unique();
    table.index('youtubeId');

    table.string('title').notNullable();

    table.string('thumbnail');

    table.string('channelTitle').notNullable();

    table.integer('viewCount').notNullable();

    table.integer('likeCount').notNullable();

    table.integer('dislikeCount').notNullable();

    table.timestamp('publishedAt').notNullable();
  });
};

export const down = async (dbConnection: Knex): Promise<void> => {
  await dbConnection.schema.dropTable('videos');
};
