const playerInstance = jwplayer('player').setup({
  file: 'not-a-real-video-file.mp4'
});

function loadError() {
  playerInstance.load('https://cdn.jwplayer.com/v2/media/7RtXk3vl?sources=236p');
  playerInstance.play();
}

// Load custom video file on error
playerInstance.on('error', loadError);

let debounce;

// Also load custom video file on buffer
playerInstance.on('buffer', function() {
  debounce = setTimeout(loadError, 5000);
});

playerInstance.on('play', function() {
  clearTimeout(debounce);
});
