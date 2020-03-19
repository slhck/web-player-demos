function performAsyncBidding(item, index) {
	// This is a mock function to demonstrate async. behavior
	return new Promise((resolve, reject) => {
		const adTags = [
			'http://playertest.longtailvideo.com/mid.xml',
			'http://playertest.longtailvideo.com/post.xml'
		]
		resolve(adTags[index - 1]);
	});
}

jwplayer('player').setup({
  playlist: [
		{
			file: "//playertest.longtailvideo.com/adaptive/bunny/manifest-no-captions.m3u8",
		},
		{
			file: "//playertest.longtailvideo.com/adaptive/bunny/manifest-no-captions.m3u8",
		},
		{
			file: "//playertest.longtailvideo.com/adaptive/bunny/manifest-no-captions.m3u8",
		},
  ],
  advertising: {
	  client: 'vast',
	  skipoffset: 2,
	  tag: 'http://playertest.longtailvideo.com/pre.xml',
  },
  height: 400,
  width: 600,
  autostart: true,
  mute: true,
})

jwplayer('player').setPlaylistItemCallback((item, index) => {
	// Resolve accepts a playlist item, this can be modified
	// The playlist item that is scheduled to load is
	// passed in as 'item'
	// Reject can be used to cancel a scheduled item from being loaded
	return new Promise((resolve, reject) => {
		// Handle external bidding and, in this example, return a modified tag
		return performAsyncBidding(item, index).then(adTag => {
		// Update the playlist item and pass it to resolve.
		const updatedAdSchedule = { tag: adTag, offset: 'pre' };
		const updatedPlaylistItem = Object.assign({}, item, { adschedule: [updatedAdSchedule] });
		resolve(updatedPlaylistItem);
		}).catch(() => {
			// If bidding fails, resolve with original, unmodified playlist item
			resolve();
		});
	}); 
});
