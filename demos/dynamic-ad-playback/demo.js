var addAdButton = document.querySelector('.message');
var tag = 'assets/preroll.xml';
var player = jwplayer('player');

player.setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/hWF9vG66',
  advertising: {
    client: 'vast'
  }
});

player.on('play', enableButton);
player.on('adSkipped', enableButton);
player.on('adComplete', enableButton);

player.on('pause',function() {
  disableButton('Unpause the video to continue.');
});

player.on('complete', function() {
  disableButton('Restart video to continue.');
});

player.on('adPlay', function() {
  disableButton('Ad playing, please wait (or skip it)')
});

player.on('adPause', function() {
  disableButton('Unpause the ad to continue.')
});

function triggerAd() {
  player.playAd(tag);
};

function enableButton() {
  addAdButton.textContent = 'Play an Ad';
  addAdButton.disabled = false;
  addAdButton.addEventListener('click', triggerAd);
};

function disableButton(messageText) {
  addAdButton.textContent = messageText;
  addAdButton.disabled = true;
  addAdButton.removeEventListener('click', triggerAd);
};
