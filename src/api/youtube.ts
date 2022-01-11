import https from 'https';
import { env } from '../env';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string | null;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  publishedAt: Date;
}

// TODO this code is not very pretty
export const getVideoById = (id: string): Promise<YouTubeVideo | null> => {
  return new Promise((resolve, reject) => {
    let responseData = '';

    const req = https.get(
      `https://www.googleapis.com/youtube/v3/videos?key=${env.youtubeAuthToken}&part=snippet,statistics&id=${id}`,
      (res) => {
        res.setEncoding('utf-8');

        if (res.statusCode !== 200) {
          return reject('Could not fetch video data from YouTube API');
        }

        res.on('data', (chunk) => (responseData += chunk));

        res.on('end', () => {
          const responseJSON = JSON.parse(responseData);

          if (!responseJSON.items || responseJSON.items.length < 1) {
            resolve(null);
          }

          const videoData = responseJSON.items[0];

          return resolve({
            id: videoData.id as string,
            title: videoData.snippet.title || '',
            thumbnail:
              videoData.snippet.thumbnails?.standard?.url ||
              videoData.snippet.thumbnails?.default?.url ||
              videoData.snippet.thumbnails?.medium?.url ||
              '',
            channelTitle: videoData.snippet.channelTitle || '',
            viewCount:
              (videoData.statistics.viewCount &&
                parseInt(videoData.statistics.viewCount, 10)) ||
              0,
            likeCount:
              (videoData.statistics.likeCount &&
                parseInt(videoData.statistics.likeCount, 10)) ||
              0,
            publishedAt:
              (videoData.snippet.publishedAt &&
                new Date(videoData.snippet.publishedAt)) ||
              new Date(0),
          });
        });
      }
    );

    req.on('error', (err) => {
      return reject(err);
    });

    req.end();
  });
};
