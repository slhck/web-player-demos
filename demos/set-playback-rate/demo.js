const configs = {
  publisher: {
    playlist: 'https://cdn.jwplayer.com/v2/media/QcK3l9Uv',
  },
  user: {
    playlist: 'http://cdn.jwplayer.com/v2/media/tkM1zvBq?sources=720p',
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
function automatePlayback({ position }) {
  if (seekComplete) {
    if (position >= replayRange.end) {
      playerInstance.setPlaybackRate(1);
      playerInstance.off('time', automatePlayback);
    }
    return;
  }

  if (position >= replayRange.end) {
    seekComplete = true;
    playerInstance.seek(replayRange.begin);
    playerInstance.setPlaybackRate(replayRange.playbackRate);
  }
}

const swap = document.getElementById('swap');
swap.addEventListener('change', ({ target: { value } }) => {
  if (playerInstance) {
    playerInstance.remove();
  }

  playerInstance = jwplayer('player').setup({
    ...configs[value],
    autostart: false,
    mute: true
  });

  playerInstance.getContainer().classList.add(value);

  if (value === 'publisher') {
    playerInstance.setCues([{ begin: 20, text: 'Instant Replay' }]);
    playerInstance.on('time', automatePlayback);
  }
});

swap.dispatchEvent(new Event('change'));
