	const playerInstance = jwplayer('player');
	const startOnSeek = document.getElementById('startOnSeek');
	let startOnSeekValue = localStorage['jwplayer.startOnSeek'] || 'pre';
	let starttimeValue = Number(localStorage['jwplayer.starttime']) || 0;

	playerInstance.setup({
		playlist: [{
			file: 'https://cdn.jwplayer.com/manifests/HoBIqXuR.m3u8',
			image: 'https://cdn.jwplayer.com/thumbs/HoBIqXuR.jpg',
			starttime: starttimeValue
		}],
		advertising: {
			client: 'vast',
			tag: 'assets/preroll.xml',
			rules: {
				startOnSeek: startOnSeekValue
			}
		}
	}).on('time', function(evt) {
		localStorage['jwplayer.starttime'] = evt.position;
	});

	startOnSeek.addEventListener('change', function(e) {
		localStorage['jwplayer.startOnSeek'] = startOnSeek.value;
	});
