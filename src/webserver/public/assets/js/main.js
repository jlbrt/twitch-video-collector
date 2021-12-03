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
        <li>${new Date(v.publishedAt).toLocaleDateString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}</li>
      </ul>
      <ul>
        <li>Chat-Votes <b>${v.votes.length}</b></li>
        <li>Likes <b>${v.likeCount.toLocaleString()}</b></li>
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
  const reloadButton = document.querySelector('#reloadButton');

  const disableButtons = () => {
    videosAllButton.disabled = true;
    videosFromNowButton.disabled = true;
    reloadButton.disabled = true;
  };
  const enableButtons = () => {
    videosAllButton.disabled = false;
    videosFromNowButton.disabled = false;
    reloadButton.disabled = false;
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

  reloadButton.addEventListener('click', async () => {
    disableButtons();
    await getAndRenderVideos();
    enableButtons();
  });
};

function feelsBirthdayMan() {
  const now = new Date();
  const isBirthday = now.getMonth() === 11 && now.getDate() === 3;
  if (isBirthday) {
    const headingImage = document.querySelector('#heading-image');
    headingImage.src =
      'https://cdn.betterttv.net/emote/55b6524154eefd53777b2580/3x';
  }
}

(async () => {
  feelsBirthdayMan();

  await getAndRenderVideos();
  registerEventListeners();
})();
