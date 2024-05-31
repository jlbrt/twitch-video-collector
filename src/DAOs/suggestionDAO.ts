import { dbConnection } from './db';

interface DBSuggestion {
  id: number;
  videoId: number;
  username: string;
  lastSuggestedAt: Date;
}

export const getSingleSuggestion = async (
  filter: Partial<DBSuggestion>
): Promise<DBSuggestion | null> => {
  const suggestion = await dbConnection<DBSuggestion>('suggestions')
    .select(['id', 'videoId', 'username', 'lastSuggestedAt'])
    .where(filter)
    .first();

  return suggestion || null;
};

export const updateSingleSuggestion = async (
  filter: Partial<DBSuggestion>,
  data: Partial<Omit<DBSuggestion, 'id'>>
): Promise<DBSuggestion> => {
  const suggestions = await dbConnection<DBSuggestion>('suggestions')
    .where(filter)
    .update(data, ['id', 'videoId', 'username', 'lastSuggestedAt']);

  return suggestions[0]!;
};

export const createSingleSuggestion = async (
  data: Omit<DBSuggestion, 'id'>
): Promise<DBSuggestion> => {
  const suggestions = await dbConnection<DBSuggestion>('suggestions').insert(
    data,
    ['id', 'videoId', 'username', 'lastSuggestedAt']
  );

  return suggestions[0]!;
};
