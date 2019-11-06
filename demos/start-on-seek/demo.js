const startOnSeekValue = localStorage.getItem('jwplayer.startOnSeek') || 'pre';
const starttime = Number(localStorage.getItem('jwplayer.starttime')) || 0;

const startOnSeek = document.getElementById('startOnSeek');
const withPreroll = document.querySelector('.with-preroll');
const withoutPreroll = document.querySelector('.without-preroll');
const demoForm = document.getElementById('demo-form');

fetch('https://cdn.jwplayer.com/v2/media/HoBIqXuR').then(r => r.json()).then(({ playlist }) => {

  // Set the media item's `starttime` value
  playlist[0].starttime = starttime;

	const playerInstance = jwplayer('player').setup({
		playlist,
		advertising: {
			client: 'vast',
			tag: 'assets/preroll.xml',
			rules: {
				startOnSeek: startOnSeekValue
			}
		}
	});

	playerInstance.on('time', ({ position }) => localStorage.setItem('jwplayer.starttime', position));

	startOnSeek.addEventListener('change', function() {
    localStorage.setItem('jwplayer.startOnSeek', this.checked ? 'pre' : 'none');
    [withPreroll, withoutPreroll].forEach(el => el.classList.remove('is-shown'));
    if (this.checked) {
      withPreroll.classList.add('is-shown');
      return;
    }
    withoutPreroll.classList.add('is-shown');
  });
  startOnSeek.dispatchEvent(new Event('change'));
});

demoForm.addEventListener('submit', e => {
  e.preventDefault()
  window.location.reload();
});
