const playerInstance = jwplayer('playerElement');

playerInstance.setup({
  file: '//playertest.longtailvideo.com/adaptive/bbbfull/bbbfull.m3u8',
  width: 500,
  aspectratio: '16:9'
});

const toggleButtons = document.querySelectorAll('.button-toggle');
const toggle = function(e) {
  const previousButton = document.querySelector('.button-toggle-on');
  const previousBody = document.querySelector('.body-toggle-on');
  previousButton.classList.remove('button-toggle-on');
  e.target.classList.add('button-toggle-on');
  previousBody.classList.remove('body-toggle-on');
  switch (e.target.dataset.toggle) {
    case 'vod':
    case 'live':
      document.getElementById('reSetupPlayerButton').classList.remove('body-toggle-on');
      document.getElementById('vodOrLive').classList.add('body-toggle-on');
      break;
    default:
      document.getElementById(e.target.dataset.toggle).classList.add('body-toggle-on');
      if (!document.getElementById('reSetupPlayerButton').classList.contains('body-toggle-on')) {
        document.getElementById('reSetupPlayerButton').classList.add('body-toggle-on');
      }
      break;
  }
};

toggleButtons.forEach((button) => {
  button.addEventListener('click', toggle);
});

