const configs = {
  publisher: {
    playlist: 'https://cdn.jwplayer.com/v2/media/QcK3l9Uv',
    controls: false
  },
  user: {
    playlist: 'https://cdn.jwplayer.com/v2/media/tkM1zvBq?sources=720p',
    playbackRateControls: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]
  }
};

const replayRange = {
  begin: 16,
  end: 20,
  playbackRate: 0.5
};

let playerInstance;
let seekComplete = false;

const replayMessage = document.getElementById('replay-message');


function automatePlayback({ position }) {
  if (seekComplete) {
    if (position >= replayRange.end) {
      playerInstance.setPlaybackRate(1);
      playerInstance.off('time', automatePlayback);
      replayMessage.classList.remove('is-active');
    }
    return;
  }

  if (position >= replayRange.end) {
    seekComplete = true;
    playerInstance.seek(replayRange.begin);
    playerInstance.setPlaybackRate(replayRange.playbackRate);
    replayMessage.classList.add('is-active');
  }
}

function toggleMute(mute) {
  customControls.classList.remove('is-muted');
  if (mute) {
    customControls.classList.add('is-muted');
  }
}

const swap = document.getElementById('swap');
const options = swap.querySelectorAll('option');
const customControls = document.getElementById('custom-controls');
swap.addEventListener('change', ({ target: { value } }) => {
  if (playerInstance) {
    playerInstance.remove();
  }

  playerInstance = jwplayer('player').setup({
    ...configs[value],
    autostart: false,
    mute: true
  });

  options.forEach(o => customControls.classList.remove(o.value));
  playerInstance.on('ready', function() {
    customControls.classList.add(value);
    toggleMute(playerInstance.getMute());
  });

  if (value === 'publisher') {
    playerInstance.setCues([{ begin: 20, text: 'Instant Replay' }]);
    playerInstance.on('time', automatePlayback);

    playerInstance.on('mute', ({ mute }) => toggleMute(mute));
  }
});

swap.dispatchEvent(new Event('change'));

const playButton = document.getElementById('play-button');
playButton.addEventListener('click', function(e) {
  e.preventDefault();
  playerInstance.play();
});

const pauseButton = document.getElementById('pause-button');
pauseButton.addEventListener('click', function(e) {
  e.preventDefault();
  playerInstance.pause();
});

const muteButton = document.getElementById('mute-button');
muteButton.addEventListener('click', function(e) {
  e.preventDefault();
  playerInstance.setMute(true);
});

const unmuteButton = document.getElementById('unmute-button');
unmuteButton.addEventListener('click', function(e) {
  e.preventDefault();
  playerInstance.setMute(false);
});
