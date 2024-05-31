import tmi from 'tmi.js';
import * as utils from './utils';
import * as videoDAO from '../DAOs/videoDAO';
import * as suggestionDAO from '../DAOs/suggestionDAO';
import * as youtubeAPI from '../api/youtube';
import * as logger from '../utils/logger';

export const handleConnected = (address: string, port: number) => {
  logger.log(`Twich Bot successfully connected to ${address}:${port}`);
};

export const handleMessage = async (
  channel: string,
  userstate: tmi.ChatUserstate,
  message: string,
  self: boolean
) => {
  try {
    const ignoredUsers = ['supibot'];

    if (!userstate.username) return;
    if (ignoredUsers.includes(userstate.username)) return;

    const youtubeVideoId = utils.getYoutubeVideoIdFromString(message);
    if (!youtubeVideoId) return;

    const existingVideo =
      await videoDAO.getSingleVideoByYoutubeId(youtubeVideoId);

    let video = existingVideo || null;

    if (!video) {
      const youtubeVideo = await youtubeAPI.getVideoById(youtubeVideoId);
      if (!youtubeVideo) return;

      video = await videoDAO.createSingleVideo({
        youtubeId: youtubeVideo.id,
        title: youtubeVideo.title,
        thumbnail: youtubeVideo.thumbnailUrl,
        channelTitle: youtubeVideo.channelTitle,
        viewCount: youtubeVideo.viewCount,
        likeCount: youtubeVideo.likeCount,
        publishedAt: youtubeVideo.publishedAt,
      });
    }

    const existingSuggestion = await suggestionDAO.getSingleSuggestion({
      username: userstate.username,
      videoId: video.id,
    });

    if (existingSuggestion) {
      await suggestionDAO.updateSingleSuggestion(
        { id: existingSuggestion.id },
        { lastSuggestedAt: new Date() }
      );

      return;
    }

    await suggestionDAO.createSingleSuggestion({
      videoId: video.id,
      username: userstate.username,
      lastSuggestedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.log('Error occured while processing handleMessage', err);
    }
  }
};
