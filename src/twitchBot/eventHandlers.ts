import tmi from 'tmi.js';
import * as utils from './utils';
import * as videoDAO from '../dao/videoDAO';
import * as suggestionDAO from '../dao/suggestionDAO';
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
    const youtubeVideoId = utils.getYoutubeVideoIdFromString(message);
    if (!youtubeVideoId) return;

    const existingVideo = await videoDAO.getSingleVideoByYoutubeId(
      youtubeVideoId
    );

    let video = existingVideo || null;

    if (!video) {
      const youtubeVideo = await youtubeAPI.getVideoById(youtubeVideoId);
      if (!youtubeVideo) return;

      video = await videoDAO.createSingleVideo({
        youtubeId: youtubeVideo.id,
        title: youtubeVideo.title,
        thumbnail: youtubeVideo.thumbnail,
        channelTitle: youtubeVideo.channelTitle,
        viewCount: youtubeVideo.viewCount,
        likeCount: youtubeVideo.likeCount,
        dislikeCount: youtubeVideo.dislikeCount,
        publishedAt: youtubeVideo.publishedAt,
      });
    }

    if (!userstate.username) return;
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
    logger.log('Error occured while processing handleMessage', err);
  }
};
