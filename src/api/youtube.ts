import { google, youtube_v3 } from 'googleapis';
import { env } from '../env';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string | null;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  publishedAt: Date;
}

const youtube = google.youtube({
  version: 'v3',
  auth: env.youtubeAuthToken,
});

export const getVideoById = async (
  id: string
): Promise<YouTubeVideo | null> => {
  const response = await youtube.videos.list({
    part: ['snippet', 'statistics'],
    id: [id],
  });

  if (!response.data.items || response.data.items.length === 0) return null;

  const videoData = response.data.items[0];
  const snippet = videoData.snippet as youtube_v3.Schema$VideoSnippet;
  const statistics = videoData.statistics as youtube_v3.Schema$VideoStatistics;

  return {
    id: videoData.id as string,
    title: snippet.title || '',
    thumbnail:
      snippet.thumbnails?.standard?.url ||
      snippet.thumbnails?.default?.url ||
      snippet.thumbnails?.medium?.url ||
      '',
    channelTitle: snippet.channelTitle || '',
    viewCount:
      (statistics.viewCount && parseInt(statistics.viewCount, 10)) || 0,
    likeCount:
      (statistics.likeCount && parseInt(statistics.likeCount, 10)) || 0,
    dislikeCount:
      (statistics.dislikeCount && parseInt(statistics.dislikeCount, 10)) || 0,
    publishedAt:
      (snippet.publishedAt && new Date(snippet.publishedAt)) || new Date(0),
  };
};
