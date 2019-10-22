const playerInstance = jwplayer('player').setup({
	aspectratio: '16:9',
	autostart: true,
	muted: true,
	playlist: 'https://cdn.jwplayer.com/v2/media/1g8jjku3',
	width: '100%'
});

const configValues = document.getElementById('config-values');

function setCaptions(config) {
	const captionsConfig = playerInstance.getCaptions();
	const values = Object.assign({}, captionsConfig, config);
	playerInstance.setCaptions(values);

	configValues.textContent = `jwplayer().setCaptions(${JSON.stringify(values, null, 2)});`;
	if (window.hljs) {
		window.hljs.highlightBlock(configValues);
	}
}

playerInstance.on('firstFrame', function() {
	playerInstance.seek(1);
	playerInstance.setCurrentCaptions(1);
	playerInstance.pause(true);
	setCaptions();
});

const form = document.getElementById('captions-styling-form');
[...form.elements].forEach(el => {
	el.addEventListener('change', ({ target: { id, value } }) => {
		setCaptions({ [id]: value });
	});
});
