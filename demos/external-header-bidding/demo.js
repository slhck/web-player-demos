function performAsyncBidding(item, index) {
	// Handle external bidding, in this case returning the new ad tag
	return new Promise((resolve, reject) => {
		const adTags = [
			'http://playertest.longtailvideo.com/mid.xml',
			'http://playertest.longtailvideo.com/post.xml'
		]
		resolve(adTags[index]);
	});
}

jwplayer('player').setPlaylistItemCallback(function(item, index) {
	return new Promise(function(resolve, reject) {
	  return performAsyncBidding(item).then(adTag => {
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
