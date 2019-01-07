(function (jwplayer) {
	'use strict';

	var dnaConfig={},
		player;
	var playerConfig = {
		"maxBufferLength": 30
	}


	jwplayer('demoplayer')
		.setup({
			playlist: [{
				file: 'https://demo-live.streamroot.io/index.m3u8'
			}],
			dnaConfig: {},
			hlsjsConfig: {
				liveSyncDuration: 40,
				liveMaxLatencyDuration: 80
			},
			logo: {
				file: './assets/logo.png',
				link: 'https://streamroot.io',
				position: 'top-left',
				margin: 25
			},
			width: 600,
			height: 400,
			autostart: true,
			mute: true
		});

	function showSR() {
		document.querySelector('#streamroot-demo-holder .content-holder .graphs').setAttribute('style', 'display:inline-block');
	}

	function hideSR() {
		document.querySelector('#warning-not-compatible').setAttribute('style', 'display:block');
	}

	var checks = 0;
	(function checkStreamroot() {
		if (Streamroot.instances.length > 0) {
			if (!Streamroot.instances[0].dnaDownloadEnabled || !Streamroot.instances[0].dnaUploadEnabled) {
				hideSR();
			} else {
				showSR();
			}
		} else if (checks < 5) {
			checks++;
			setTimeout(checkStreamroot, 500);
		} else {
			console.log('ouch');
			hideSR();
		}
	})()

})(jwplayer);
