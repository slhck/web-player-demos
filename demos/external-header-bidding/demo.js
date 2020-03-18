function performAsyncBidding(item, index) {
	// This is a mock function to demonstrate async. behavior
	return new Promise((resolve, reject) => {
		const adTags = [
			'http://playertest.longtailvideo.com/mid.xml',
			'http://playertest.longtailvideo.com/post.xml'
		]
		resolve(adTags[index]);
	});
}

jwplayer('player').setPlaylistItemCallback((item, index) => {
	// Resolve accepts a playlist item, this can be modified
	// The playlist item that is scheduled to load is
	// passed in as 'item'
	// Reject can be used to cancel a scheduled item from being loaded
	return new Promise((resolve, reject) => {
	  // Handle external bidding and, in this example, return a modified tag
	  return performAsyncBidding(item).then(adTag => {
		// Update the playlist item and pass it to resolve.
		const updatedAdSchedule = { tag: adTag, offset: 'pre' };
		const updatedPlaylistItem = Object.assign({}, item, { adschedule: updatedAdSchedule });
		resolve(updatedPlaylistItem);
	  }).catch(() => {
		  // If bidding fails, resolve with original, unmodified playlist item
		  resolve(item);
	  });
	}); 
  });

jwplayer('player').setup({
  playlist: [
		{
			file: "//content.jwplatform.com/videos/aeZLVVPv-v7C1BfDE.mp4",
			image: "//content.jwplatform.com/thumbs/aeZLVVPv-480.jpg",
			height: "100%",
			width: "70%"
		},
		{
			file: "//content.jwplatform.com/videos/aeZLVVPv-v7C1BfDE.mp4",
			image: "//content.jwplatform.com/thumbs/aeZLVVPv-480.jpg",
			height: "100%",
			width: "70%"
		},
		{
			file: "//content.jwplatform.com/videos/aeZLVVPv-v7C1BfDE.mp4",
			image: "//content.jwplatform.com/thumbs/aeZLVVPv-480.jpg",
			height: "100%",
			width: "70%"
		},
  ],
  advertising: {
	  client: 'googima',
	  tag: 'http://playertest.longtailvideo.com/pre.xml',
  },
  autostart: true,
  mute: true,
});
