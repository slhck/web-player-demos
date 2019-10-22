const playerInstance = jwplayer('player');

const baseConfig = {
  playlist: [{
    file: 'https://cdn.jwplayer.com/manifests/Qlh3p9ly.m3u8'
  }],
  advertising: { client: 'dai' }
}

const customVodCmsID = document.getElementById('cmsID');
const customVodVideoID = document.getElementById('videoID');
const customLiveAssetKey = document.getElementById('assetKey');
const toggles = [...document.getElementsByName('toggle')];
const codeBlock = document.getElementById('codeblock');

function setupPlayer() {
  let cmsID;
  let videoID;
  let assetKey;

  const thisConfig = Object.assign({}, baseConfig);
  const checked = toggles.find(t => t.checked).value;

  if (checked.includes('vod')) {
    cmsID = 2477953;
    videoID = 'tears-of-steel';

    if (checked.includes('custom')) {
      cmsID = customVodCmsID.value || cmsID;
      videoID = customVodVideoID.value || videoID;
    }
  }

  if (checked.toLowerCase().includes('live')) {
    assetKey = 'sN_IYUG8STe1ZzhIIE_ksA';

    if (checked.includes('custom')) {
      assetKey = customLiveAssetKey.value || assetKey;
    }
  }

  thisConfig.playlist[0].daiSetting = {
    assetKey,
    cmsID,
    videoID
  };

  playerInstance.setup(thisConfig);
  playerInstance.on('ready', function() {
    codeBlock.textContent = `jwplayer().setup(${JSON.stringify(thisConfig, null, 2)});`;
    if (window.hljs) {
      window.hljs.highlightBlock(codeBlock);
    }
  });
}

const resetButton = document.getElementById('reset-button');
const preconfigured = document.getElementById('preconfigured');

function showPreconfiguredBody() {
  resetButton.classList.remove('is-visible');
  preconfigured.classList.add('is-visible');
}

function toggle({ target }) {
  const previousBody = document.querySelector('.is-visible');
  let detailsId = target.value;
  if (previousBody) {
    previousBody.classList.remove('is-visible');
  }
  target.classList.add('button-toggle-on');

  if (target.value === 'vod' || target.value === 'live') {
    detailsId = 'preconfigured';
    showPreconfiguredBody();
    setupPlayer();
    return;
  }

  document.getElementById(detailsId).classList.add('is-visible');
  if (!resetButton.classList.contains('is-visible')) {
    resetButton.classList.add('is-visible');
  }
}

resetButton.addEventListener('click', e => {
  e.preventDefault();
  setupPlayer();
});

toggles.forEach(t => t.addEventListener('change', toggle));
toggles.find(t => t.checked).dispatchEvent(new Event('change'));
