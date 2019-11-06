const playerInstance = jwplayer('player').setup({
  file: 'not-a-real-video-file.mp4',
  displaytitle: false,
  displaydescription: false
});

const handleError = () => {
  playerInstance.load('https://cdn.jwplayer.com/v2/media/7RtXk3vl');
  playerInstance.setControls(false);
  playerInstance.play();
};

// Load custom video file on error
playerInstance.on('error', handleError);

let debounce;

// Also load custom video file on buffer
playerInstance.on('buffer', function() {
  debounce = setTimeout(handleError, 5000);
});

playerInstance.on('play', function() {
  clearTimeout(debounce);
});
