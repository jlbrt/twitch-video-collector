import getYoutubeId from 'get-youtube-id';

export const getYoutubeVideoIdFromString = (string: string): string | null => {
  return getYoutubeId(string, { fuzzy: false });
};
