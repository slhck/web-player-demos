const impression = document.getElementById('impression');
const bidRequest = document.getElementById('bid-request');
const bidResponse = document.getElementById('bid-response');
const codeBlock = document.getElementById('code-block');
const mediationLayerSelect = document.getElementById('mediationLayerSelect');

const extendConfig = ({ mediationLayerAdServer, tag }) => ({
	playlist: 'https://cdn.jwplayer.com/v2/media/1g8jjku3',
	advertising: {
		client: 'googima',
		schedule: {
			adBreak: {
				offset: 'pre',
				tag
			}
		},
		bids: {
			settings: {
				bidTimeout: 1000,
				floorPriceCents: 2,
				floorPriceCurrency: 'usd',
				mediationLayerAdServer
			},
			bidders: [{
				name: 'SpotX',
				id: '85394'
			}]
		}
	}
});

const jwp = extendConfig({
	mediationLayerAdServer: 'jwp',
	tag: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=sample_ct%3Dskippablelinear&correlator=',
});

const dfp = extendConfig({
	tag: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/137679306/HB_Dev_Center_Example&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&correlator=',
	mediationLayerAdServer: 'dfp'
});

const configs = { jwp, dfp };

function setCodeBlock(thisConfig) {
	const pre = document.createElement('pre');
	const code = document.createElement('code');
	code.textContent = `const playerInstance = jwplayer('player').setup(${JSON.stringify(thisConfig, null, 2)});`;
	pre.appendChild(code);

	while (codeBlock.hasChildNodes() === true) {
		codeBlock.removeChild(codeBlock.firstChild);
	}
	codeBlock.appendChild(pre);
	if (window.hljs) {
		window.hljs.highlightBlock(code);
	}
}

function setupPlayer(mediationLayer) {
	[impression, bidRequest, bidResponse].forEach(el => el.checked = false);
	const thisConfig = configs[mediationLayer];
	const playerInstance = jwplayer('player').setup(thisConfig);

	playerInstance.on('adImpression', e => {
		const isWinner = winner(e);
		impression.setAttribute('value', isWinner);
		impression.checked = true;
		console.log(isWinner);
	});

	playerInstance.on('adBidRequest', () => bidRequest.checked = true);
	playerInstance.on('adBidResponse', () => bidResponse.checked = true);

	setCodeBlock(thisConfig);
}

function winner({ adsystem, bidders, mediationLayerAdServer }) {
	if (mediationLayerAdServer === 'dfp') {
		return adsystem === 'SpotXchange';
	}

	if (!bidders) {
		return false;
	}

	for (const { name, winner } of bidders) {
		if (winner && name === 'SpotX') {
			return true;
		}
	}

	return false;
}

mediationLayerSelect.addEventListener('change', e => setupPlayer(e.target.value), false);
mediationLayerSelect.dispatchEvent(new Event('change'));
