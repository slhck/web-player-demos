function isUserAuthorized(item, index) {
	// Handle any asynchronous custom logic
	return new Promise((resolve, reject) => {
		// Simulated to skip second playlist item
		const shouldCancel = index === 1;
		resolve(shouldCancel);
	});
}

jwplayer().setPlaylistItemCallback((item, index) => {
	// Resolve accepts a playlist item, this can be modified
	// The playlist item that is scheduled to load is
	// passed in as 'item'
	// Reject can be used to cancel a scheduled item from being loaded
	return new Promise((resolve, reject) => {
	  // Handle external bidding and, in this example, return a boolean indicating
	  // whether user is authorized
	  return isUserAuthorized(item, index).then(isAuthorized => {
		if (!isAuthorized) {
			// Reject cancels playback and skips to next item.
			reject();
		}
		// If authorized, load and play item.
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
  autostart: true,
  mute: true,
});
