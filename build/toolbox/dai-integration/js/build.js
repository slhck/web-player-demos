const playerInstance = jwplayer('playerElement');

const setupVodPlayer = function(cmsId = 2477953, videoId = "tears-of-steel") {
  playerInstance.setup({
    "playlist": [{
      "file": "//content.jwplatform.com/manifests/Qlh3p9ly.m3u8",
      "daiSetting": {
        "cmsID": cmsId,
        "videoID": videoId
      }
    }],
    "advertising": {
      "client": "dai"
    }
  });
};

const setupLivePlayer = function(assetKey = "sN_IYUG8STe1ZzhIIE_ksA") {
  playerInstance.setup({
    "playlist": [{
      "file": "//content.jwplatform.com/manifests/Qlh3p9ly.m3u8",
      "daiSetting": {
        "assetKey": assetKey
      }
    }],
    "advertising": {
      "client": "dai"
    }
  });
};

setupVodPlayer();

const toggleButtons = document.querySelectorAll('.button-toggle');
const reSetupPlayerButton = document.getElementById('reSetupPlayerButton');

const toggle = function(e) {
  const previousButton = document.querySelector('.button-toggle-on');
  const previousBody = document.querySelector('.body-toggle-on');
  previousButton.classList.remove('button-toggle-on');
  e.target.classList.add('button-toggle-on');
  previousBody.classList.remove('body-toggle-on');

  document.querySelector('.code-toggle-on').classList.remove('code-toggle-on');
  document.getElementById('codeBlock_' + e.target.dataset.toggle).classList.add('code-toggle-on');

  const showVodOrLiveBody = function() {
      reSetupPlayerButton.classList.remove('body-toggle-on');
      document.getElementById('vodOrLive').classList.add('body-toggle-on');
  };

  switch (e.target.dataset.toggle) {
    case 'vod':
      showVodOrLiveBody();
      setupVodPlayer();

      break;

    case 'live':
      showVodOrLiveBody();
      setupLivePlayer();

      break;

    default:
      document.getElementById(e.target.dataset.toggle).classList.add('body-toggle-on');

      if (!reSetupPlayerButton.classList.contains('body-toggle-on')) {
        reSetupPlayerButton.classList.add('body-toggle-on');
      }

      break;
  }
};

const handleReSetup = function() {
  const type = document.querySelector('div.body-toggle-on');
  const inputs = type.querySelectorAll('input');

  switch (type.id) {
    case 'customVod':
      const cmsID = inputs[0].value || 2477953;
      const videoID = inputs[1].value || 'tears-of-steel';
      document.getElementById('customVod_cmsID').textContent = cmsID;
      document.getElementById('customVod_videoID').textContent = `"${videoID}"`;
      setupVodPlayer(cmsID, videoID);
      break;

    case 'customLive':
      const assetKey = inputs[0].value || "sN_IYUG8STe1ZzhIIE_ksA";
      document.getElementById('customLive_assetKey').textContent = `"${assetKey}"`;
      setupLivePlayer(assetKey);
      break;
  }
};

reSetupPlayerButton.addEventListener('click', handleReSetup);

toggleButtons.forEach((button) => {
  if (button.id !== 'reSetupPlayerButton') {
    button.addEventListener('click', toggle);
  }
});
