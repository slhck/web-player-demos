let scrollThreshold;
let scrollTimeout;
let animationFrame;
let lastThreshold;
let currentThreshold;
let scrollHeight = 0;
const banner = document.querySelector('.footer-banner');
const videoTitle = banner.querySelector('.video-title');

const playerInstance = jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/4yN3Zspm',
  autostart: true,
  mute: true
});

playerInstance.on('ready', function() {
  let element = playerInstance.getContainer();
  let elementYOffset = 0;
  const ninetyPercentElementHeight = element.offsetHeight * 0.9;

  while (element) {
    elementYOffset += element.offsetTop;
    element = element.offsetParent;
  }

  scrollThreshold = elementYOffset + ninetyPercentElementHeight;
});

playerInstance.on('playlistItem', e => videoTitle.textContent = e.item.title);

banner.querySelector('.playback-btn').addEventListener('click', () => {
  togglePlayback(playerInstance.getState() === 'paused');
});

playerInstance.on('pause', () => banner.classList.add('is-paused'));
playerInstance.on('play', () => banner.classList.remove('is-paused'));
playerInstance.on('complete', () => banner.classList.add('is-paused'));

window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    scrollTimeout = clearTimeout(scrollTimeout);
  }

  if (!animationFrame) {
    update();
  }

  scrollTimeout = setTimeout(() => {
    animationFrame = cancelAnimationFrame(animationFrame);
    scrollHeight = window.pageYOffset;
  }, 100);
}, false);

function update() {
  if (scrollHeight <= window.pageYOffset) {
    banner.classList.add('is-visible');
  } else {
    banner.classList.remove('is-visible');
  }

  lastThreshold = scrollHeight > scrollThreshold;
  currentThreshold = window.pageYOffset > scrollThreshold;

  if (lastThreshold !== currentThreshold) {
    togglePlayback(!currentThreshold);
  }

  animationFrame = requestAnimationFrame(update);
}

function togglePlayback(triggerPlay) {
  if (triggerPlay) {
    playerInstance.play();
  } else {
    playerInstance.pause();
  }
}
