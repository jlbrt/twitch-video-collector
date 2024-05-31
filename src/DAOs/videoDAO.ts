import { dbConnection } from './db';

interface DBVideo {
  id: number;
  youtubeId: string;
  title: string;
  thumbnail: string | null;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  publishedAt: Date;
}

interface VideoWithSuggestions {
  youtubeId: string;
  title: string;
  thumbnail: string | null;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  votes: string[];
  publishedAt: Date;
  lastVote: Date;
}

export const getSingleVideoByYoutubeId = async (
  youtubeId: string
): Promise<DBVideo | null> => {
  const video = await dbConnection<DBVideo>('videos')
    .select([
      'id',
      'youtubeId',
      'title',
      'thumbnail',
      'channelTitle',
      'viewCount',
      'likeCount',
      'publishedAt',
    ])
    .where({ youtubeId })
    .first();

  return video || null;
};

export const createSingleVideo = async (
  data: Omit<DBVideo, 'id'>
): Promise<DBVideo> => {
  const videos = await dbConnection<DBVideo>('videos').insert(data, [
    'id',
    'youtubeId',
    'title',
    'thumbnail',
    'channelTitle',
    'viewCount',
    'likeCount',
    'publishedAt',
  ]);

  return videos[0]!;
};

export const getVideosWithSuggestions = async (
  fromTimestamp: Date
): Promise<VideoWithSuggestions[]> => {
  interface DBSuggestionVideoJoin {
    username: string;
    videoId: number;
    lastSuggestedAt: Date;
    youtubeId: string;
    title: string;
    thumbnail: string | null;
    channelTitle: string;
    viewCount: number;
    likeCount: number;
    publishedAt: Date;
  }

  const suggestions: DBSuggestionVideoJoin[] = await dbConnection('suggestions')
    .select([
      'suggestions.username',
      'suggestions.videoId',
      'suggestions.lastSuggestedAt',
      'videos.youtubeId',
      'videos.title',
      'videos.thumbnail',
      'videos.channelTitle',
      'videos.viewCount',
      'videos.likeCount',
      'videos.publishedAt',
    ])
    .innerJoin('videos', 'suggestions.videoId', 'videos.id')
    .where('suggestions.lastSuggestedAt', '>=', fromTimestamp);

  const videos: { [key: string]: VideoWithSuggestions } = {};
  for (const suggestion of suggestions) {
    if (!videos[suggestion.videoId]) {
      videos[suggestion.videoId] = {
        youtubeId: suggestion.youtubeId,
        title: suggestion.title,
        thumbnail: suggestion.thumbnail,
        channelTitle: suggestion.channelTitle,
        viewCount: suggestion.viewCount,
        likeCount: suggestion.likeCount,
        votes: [],
        publishedAt: suggestion.publishedAt,
        lastVote: suggestion.lastSuggestedAt,
      };
    }

    videos[suggestion.videoId]!.votes.push(suggestion.username);

    if (videos[suggestion.videoId]!.lastVote < suggestion.lastSuggestedAt) {
      videos[suggestion.videoId]!.lastVote = suggestion.lastSuggestedAt;
    }
  }

  const returnVideosWithSuggestions = Object.keys(videos).map(
    (key) => videos[key]!
  );

  const returnVideosWithSuggestionsSorted = returnVideosWithSuggestions.sort(
    (a, b) => {
      if (a.votes.length === b.votes.length) {
        return b.lastVote.getTime() - a.lastVote.getTime();
      } else {
        return b.votes.length - a.votes.length;
      }
    }
  );

  return returnVideosWithSuggestionsSorted;
};
