const hash = window.location.hash;
let offset = hash ? Number(window.location.hash.substr(3)) : false;
let shouldPlay = !!hash;

const playerInstance = jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/1b02B03R',
  autostart: shouldPlay
});

playerInstance.on('firstFrame', () => {
  if (offset) {
    playerInstance.seek(offset);
  }
  offset = false;
});

document.getElementById('set-offset').addEventListener('click', () => {
  window.location.hash = '#t=15';
  window.location.reload();
});
