const youtubeVideoIdPatterns = [
  /youtu\.be\/([^#\&\?]{11})/, // youtu.be/<id>
  /\?v=([^#\&\?]{11})/, // ?v=<id>
  /\&v=([^#\&\?]{11})/, // &v=<id>
  /embed\/([^#\&\?]{11})/, // embed/<id>
  /\/v\/([^#\&\?]{11})/, // /v/<id>
];

export const getYoutubeVideoIdFromString = (string: string): string | null => {
  const isYoutubeLink = /youtu\.?be/.test(string);

  if (!isYoutubeLink) return null;

  for (let i = 0; i < youtubeVideoIdPatterns.length; i++) {
    if (youtubeVideoIdPatterns[i].test(string)) {
      return youtubeVideoIdPatterns[i].exec(string)![1];
    }
  }

  return null;
};
