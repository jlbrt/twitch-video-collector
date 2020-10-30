const sanitizeHTML = (str) => {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

const renderVideos = (videos, fromTimestampInfoMessage = '') => {
  const videoElements = videos.map((v) => {
    return `
    <article class="videos__item">
    <a href="https://www.youtube.com/watch?v=${
      v.youtubeId
    }" target="_blank" class="videos__image">
      <img
        src="${v.thumbnail}"
        alt=""
      />
    </a>
    <div class="videos__content">
      <h2>
        <a href="https://www.youtube.com/watch?v=${
          v.youtubeId
        }" target="_blank">${sanitizeHTML(v.title)}</a>
      </h2>
      <ul>
        <li>${sanitizeHTML(v.channelTitle)}</li>
        <li>${new Date(v.publishedAt).toLocaleDateString()}</li>
      </ul>
      <ul>
        <li>Chat-Votes <b>${v.votes.length}</b></li>
        <li>Likes <b>${
          v.likeCount || v.dislikeCount
            ? Math.round((v.likeCount / (v.likeCount + v.dislikeCount)) * 100)
            : 0
        }%</b></li>
        <li>Views <b>${v.viewCount.toLocaleString()}</b></li>
      </ul>
    </div>
  </article>
    `;
  });

  const videoContainer = document.querySelector('#videos');
  videoContainer.innerHTML = videoElements.join('\n');

  const fromTimestampInfo = document.querySelector('#fromTimestampInfo');
  fromTimestampInfo.textContent = fromTimestampInfoMessage;
};

const getVideos = async (fromTimestamp = new Date(0)) => {
  const response = await fetch(
    `/suggestions?fromTimestamp=${fromTimestamp.getTime()}`
  );
  const responseData = await response.json();

  return responseData.data;
};

const setFromTimestamp = (fromTimestamp) => {
  localStorage.setItem('fromTimestamp', fromTimestamp);
};

const getFromTimestamp = (fromTimestamp) => {
  const res = localStorage.getItem('fromTimestamp', fromTimestamp);
  return new Date(res || 0);
};

const getAndRenderVideos = async () => {
  const fromTimestamp = getFromTimestamp();
  const videos = await getVideos(fromTimestamp);

  const fromTimestampInfoMessage =
    fromTimestamp.getTime() === 0
      ? 'Es werden alle Video angezeigt'
      : `Es werden Videos angezeigt, die nach ${fromTimestamp.toLocaleString()} gepostet wurden`;

  renderVideos(videos, fromTimestampInfoMessage);
};

const registerEventListeners = () => {
  const videosAllButton = document.querySelector('#videosAllButton');
  const videosFromNowButton = document.querySelector('#videosFromNowButton');

  const disableButtons = () => {
    videosAllButton.disabled = true;
    videosFromNowButton.disabled = true;
  };
  const enableButtons = () => {
    videosAllButton.disabled = false;
    videosFromNowButton.disabled = false;
  };

  videosAllButton.addEventListener('click', async () => {
    disableButtons();
    setFromTimestamp(new Date(0));
    await getAndRenderVideos();
    enableButtons();
  });

  videosFromNowButton.addEventListener('click', async () => {
    disableButtons();
    setFromTimestamp(new Date());
    await getAndRenderVideos();
    enableButtons();
  });
};

const autoRefresh = async () => {
  await getAndRenderVideos();
  setTimeout(() => {
    autoRefresh();
  }, 5000);
};

(async () => {
  await autoRefresh();
  registerEventListeners();
})();
