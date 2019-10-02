const container = document.getElementById('js-background-video-container');
let fullPlaylist;

function setupPlayer() {
  let isReady = false;

  const playerInstance = jwplayer('js-background-video').setup({
    autostart: true,
    controls: false,
    playlist: fullPlaylist,
    mute: true,
    repeat: true,
    displaytitle: false,
    displaydescription: false,
    stretching: 'fill',
    height: '100%',
    width: '100%'
  });

  playerInstance.on('firstFrame', e => container.classList.remove('is-fading'));

  playerInstance.on('complete', () => isReady = false);

  playerInstance.on('time', function(e) {
    if (e.position >= (e.duration - 2) && !isReady) {
      isReady = true;
      container.addClass('is-fading');
    }
  });


  container.addEventListener('transitionend', () => {
    if (!container.classList.contains('is-fading')) {
      let posterImage;
      let nextIndex = playerInstance.getPlaylistIndex() + 1;
      nextIndex = nextIndex >= fullPlaylist.length ? 0 : nextIndex;
      posterImage = fullPlaylist[nextIndex]['image'];
      const img = document.createElement('img');
      img.onload = e => container.style.backgroundImage = `url(${posterImage})`;
      img.src = posterImage;
    }
  });

  container.dispatchEvent(new Event('transitionend'));
}

fetch('https://cdn.jwplayer.com/v2/media/oSRD4xzP').then(r => r.json()).then(data => {
  fullPlaylist = data.playlist;
  setupPlayer();
});
