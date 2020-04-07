// Your line-item configured DFP tag.
const DFP_TAG = 'https://pubads.g.doubleclick.net/gampad/ads?' +
    'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
    'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
    'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

// Timeout in case Prebid.js doesn't load.
const FAILSAFE_TIMEOUT = 3_000; // 3s.

// Set-up Prebid on the page.
const pbjs = window.pbjs = window.pbjs || {};
pbjs.que = pbjs.que || [];
pbjs.que.push(() => {
    pbjs.setConfig({
        debug: true
    });
});
const pbjsLoaded = new Promise((resolve, reject) => {
    pbjs.que.push(resolve);
    setTimeout(reject, FAILSAFE_TIMEOUT);
});

// Callback which performs Prebid.js header bidding.
function performAsyncBidding(player, item, index) {
    const videoAdUnit = {
        code: `video-${index}`,
        mediaTypes: {
            video: {
                playerSize: [
                    // Dimensions might not be final while player is setting up.
                    player.getWidth() || 640,
                    player.getHeight() || 360
                ],
                context: 'instream'
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13232361,
            }
        }]
    };
    return new Promise(resolve => {
        pbjs.addAdUnits(videoAdUnit);
        pbjs.requestBids({ bidsBackHandler: resolve });
    }).then(() => {
        // Make sure you are using Prebid.js with the DFP Video module.
        return pbjs.adServers.dfp.buildVideoUrl({
            adUnit: videoAdUnit,
            url: DFP_TAG
        });
    });
}

// Set-up JW Player.
const player = jwplayer('player').setup({
    playlist: [{
        file: '//playertest.longtailvideo.com/adaptive/bunny/manifest-no-captions.m3u8',
    }, {
        file: '//playertest.longtailvideo.com/adaptive/bunny/manifest-no-captions.m3u8',
    }, {
        file: '//playertest.longtailvideo.com/adaptive/bunny/manifest-no-captions.m3u8',
    }],
    advertising: {
        client: 'googima',
        tag: DFP_TAG,
        bids: {
            settings: {
                mediationLayerAdServer: 'dfp'
            },
            bidders: [
                /* JW Player Video Player Bidding SSP partner configuration */
            ]
        }
    }
});
player.setPlaylistItemCallback((item, index) => {
    return pbjsLoaded // Wait until Prebid.js is loaded.
        .then(() => performAsyncBidding(player, item, index)) // External bidding.
        .then(tag => {
            // Update the playlist item.
            return Object.assign({}, item, {
                adschedule: [{
                    tag,
                    offset: 'pre'
                }]
            });
        }).catch(() => item); // If bidding fails, use unmodified playlist item.
});
