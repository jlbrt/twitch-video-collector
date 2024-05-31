import assert from 'node:assert';
import { z } from 'zod';
import { env } from '../env';

type YouTubeVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId: string;
  viewCount: number;
  likeCount: number;
  publishedAt: Date;
};

const videosListResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      snippet: z.object({
        publishedAt: z.coerce.date(),
        title: z.string(),
        channelTitle: z.string(),
        channelId: z.string(),
        thumbnails: z.object({
          default: z.object({ url: z.string() }).optional(),
          medium: z.object({ url: z.string() }).optional(),
          high: z.object({ url: z.string() }).optional(),
          standard: z.object({ url: z.string() }).optional(),
          maxres: z.object({ url: z.string() }).optional(),
        }),
      }),
      statistics: z.object({
        viewCount: z.coerce.number(),
        likeCount: z.coerce.number(),
      }),
    })
  ),
});

export async function getVideoById(id: string): Promise<YouTubeVideo | null> {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('key', env.youtubeAuthToken);
  url.searchParams.set('part', 'snippet,statistics');
  url.searchParams.set('id', id);

  const res = await fetch(url);
  const resData = await res.json();

  const parsedResData = videosListResponseSchema.parse(resData);

  if (parsedResData.items.length === 0) return null;
  assert(parsedResData.items[0]);

  const thumbnail =
    parsedResData.items[0].snippet.thumbnails.high ||
    parsedResData.items[0].snippet.thumbnails.standard ||
    parsedResData.items[0].snippet.thumbnails.medium ||
    parsedResData.items[0].snippet.thumbnails.maxres ||
    parsedResData.items[0].snippet.thumbnails.default;

  if (!thumbnail) return null;

  const video: YouTubeVideo = {
    id: parsedResData.items[0].id,
    title: parsedResData.items[0].snippet.title,
    thumbnailUrl: thumbnail.url,
    channelTitle: parsedResData.items[0].snippet.channelTitle,
    channelId: parsedResData.items[0].snippet.channelId,
    viewCount: parsedResData.items[0].statistics.viewCount,
    likeCount: parsedResData.items[0].statistics.likeCount,
    publishedAt: parsedResData.items[0].snippet.publishedAt,
  };

  return video;
}
