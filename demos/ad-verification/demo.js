const playerInstance = jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/hWF9vG66',
  advertising: {
    client: 'vast',
    tag: 'assets/preroll.xml'
  }
});

const adImpression = document.getElementById('impression');
playerInstance.on('adImpression', function() {
  adImpression.checked = true;
});

const adSkipped = document.getElementById('skip');
playerInstance.on('adSkipped', function() {
  adSkipped.checked = true;
});

const progress = document.getElementById('progress');
const remaining = document.getElementById('remaining');
playerInstance.on('adTime', function(event) {
  const { duration, position } = event;
  if (!progress.checked) {
    progress.checked = true;
  }
  remaining.value = Math.ceil(duration - position);
});

const adClick = document.getElementById('click');
playerInstance.on('adClick', function() {
  adClick.checked = true;
});

const adComplete = document.getElementById('complete');
playerInstance.on('adComplete', function() {
  adComplete.checked = true;
});
