const sanitizeHTML = (str) => {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

const renderVideos = (videos) => {
  const videoElements = videos.map((v) => {
    return `
    <article class="videos__item">
    <a href="https://www.youtube.com/watch?v=${
      v.youtubeId
    }" class="videos__image">
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
        <li>Likes <b>${Math.round(
          (v.likeCount / (v.likeCount + v.dislikeCount)) * 100
        )}%</b></li>
        <li>Views <b>${v.viewCount.toLocaleString()}</b></li>
      </ul>
    </div>
  </article>
    `;
  });

  const videoContainer = document.querySelector('#videos');
  videoContainer.innerHTML = videoElements.join('\n');
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
  const videos = await getVideos(getFromTimestamp());
  renderVideos(videos);
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
