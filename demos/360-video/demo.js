const errorDiv = document.getElementById('error');
function handleError(e) {
	// console.error(`Error: ${message}`);
	console.log('hi');
	errorDiv.textContent = e.message;
	errorDiv.classList.add('active');
}

function setupPlayer(playlist) {
	const playerInstance = jwplayer('player');

	playerInstance.on('error', e => {
		console.log(e.code);
		if (e.code >= 307000 && e.code <= 307999) {
			handleError(e);
		}
	});

	playerInstance.on('ready', () => {
		const vrPlugin = playerInstance.getPlugin('vr');

		if (vrPlugin) {
			vrPlugin.on('error', e => handleError(e));
		}
	});

	playerInstance.setup({ playlist });
}

const playlistUrl = 'https://cdn.jwplayer.com/v2/media/AgqYcfAT';
fetch(playlistUrl).then(r => r.json()).then(playlist => {
	// iOS doesn't support CORS https://bugs.webkit.org/show_bug.cgi?id=135379
	if (navigator.userAgent.match(/iP(hone|ad|od)/i) !== null) {
		playlist.playlist[0].sources = [{
			file: `assets/AgqYcfAT-FctPAkow.mp4`,
			type: 'video/mp4'
		}];
	}

	setupPlayer(playlist);
});
