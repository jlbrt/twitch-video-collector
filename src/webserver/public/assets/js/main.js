const renderCard = (cardData) => {
  return `
    <a href="${cardData.targetLink}" target="_blank" class="card_wrapper_link">
        <div class="card">
          <img src="${cardData.thumbnail}" alt="" />
          <div class="content">
            <h2>${cardData.heading}</h2>
            <p class="card-subheading">${cardData.subheading}</p>
            <p title="${cardData.voters.join(', ')}"><b>Chat-Votes:</b> ${
    cardData.votes
  }</p>
            <p><b>Like/Dislike:</b> ${cardData.likeRatio}%</p>
            <p><b>Views:</b> ${cardData.views}</p>
          </div>
        </div>
      </a>
    `;
};

const renderCardsToDOM = (cards) => {
  const main = document.querySelector('.main');

  const cardsNode = cards.join('\n');

  main.innerHTML = cardsNode;
};

const sanitizeHTML = (str) => {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

const resetAndRenderCardsList = async (fromTimestamp = 0) => {
  const suggestionsRes = await fetch(
    `/suggestions?fromTimestamp=${fromTimestamp}`
  );
  const { data: suggestions } = await suggestionsRes.json();

  const cards = suggestions.map((s) =>
    renderCard({
      targetLink: `https://www.youtube.com/watch?v=${sanitizeHTML(
        s.youtubeId
      )}`,
      thumbnail: sanitizeHTML(s.thumbnail || ''),
      heading: sanitizeHTML(s.title || ''),
      subheading: `${new Date(
        s.publishedAt
      ).toLocaleDateString()} - ${sanitizeHTML(s.channelTitle)}`,
      votes: s.votes.length,
      voters: s.votes.map((v) => sanitizeHTML(v)),
      likeRatio: Math.round(
        (s.likeCount / (s.likeCount + s.dislikeCount)) * 100
      ),
      views: parseInt(s.viewCount).toLocaleString(),
    })
  );

  renderCardsToDOM(cards);
};

//   const refreshbutton = document.querySelector('#button_refresh');
const videosFromNowButton = document.querySelector('#button_videosFromNow');
const videosAllButton = document.querySelector('#button_videosAll');
const toggleRefreshButton = document.querySelector('#button_toggleRefresh');
const postedSince = document.querySelector('#postedSince');

const disableButtons = () => {
  // refreshbutton.disabled = true;
  videosFromNowButton.disabled = true;
  videosAllButton.disabled = true;
};
const enableButtons = () => {
  // refreshbutton.disabled = false;
  videosFromNowButton.disabled = false;
  videosAllButton.disabled = false;
};

let selectedFromTimestamp =
  parseInt(localStorage.getItem('fromTimestamp'), 10) || 0;

const updatePostedSinceMessage = () => {
  postedSince.textContent = `Es werden Videos angezeigt, die seit ${new Date(
    selectedFromTimestamp
  ).toLocaleString()} im Chat gepostet wurden.`;
};

let refreshTimeout = null;
let autoRefreshActive;
const autoRefresh = () => {
  autoRefreshActive = true;
  refreshTimeout = setTimeout(async () => {
    await resetAndRenderCardsList(selectedFromTimestamp);
    autoRefresh();
  }, 5000);
};

const toggleRefresh = async () => {
  if (autoRefreshActive) {
    clearTimeout(refreshTimeout);
    toggleRefreshButton.textContent = 'Aktualisieren fortsetzen';
    autoRefreshActive = false;
  } else {
    await resetAndRenderCardsList(selectedFromTimestamp);
    autoRefresh();
    toggleRefreshButton.textContent = 'Aktualisieren unterbrechen';
    autoRefreshActive = true;
  }
};

(async () => {
  await resetAndRenderCardsList(selectedFromTimestamp);

  updatePostedSinceMessage();

  autoRefresh();

  //   {
  //     refreshbutton.addEventListener('click', async (e) => {
  //       e.preventDefault();

  //       disableButtons();
  //       await resetAndRenderCardsList(selectedFromTimestamp);
  //       setTimeout(() => {
  //         enableButtons();
  //       }, 2000);
  //     });
  //   }

  {
    videosAllButton.addEventListener('click', async (e) => {
      e.preventDefault();

      disableButtons();
      localStorage.setItem('fromTimestamp', 0);
      selectedFromTimestamp = 0;
      await resetAndRenderCardsList(selectedFromTimestamp);
      updatePostedSinceMessage();
      setTimeout(() => {
        enableButtons();
      }, 2000);
    });
  }

  {
    videosFromNowButton.addEventListener('click', async (e) => {
      e.preventDefault();

      disableButtons();
      const time = new Date().getTime();
      localStorage.setItem('fromTimestamp', time);
      selectedFromTimestamp = time;
      updatePostedSinceMessage();
      await resetAndRenderCardsList(selectedFromTimestamp);
      setTimeout(() => {
        enableButtons();
      }, 2000);
    });
  }

  {
    toggleRefreshButton.addEventListener('click', async (e) => {
      e.preventDefault();

      toggleRefresh();
    });
  }
})();
