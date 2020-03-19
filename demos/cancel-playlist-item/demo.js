function isUserAuthorized(item, index) {
	// Handle any asynchronous custom logic
  return new Promise((resolve, reject) => {
	// Simulated to skip second playlist item
	const isAuthorized = index !== 1;
	resolve(isAuthorized);
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
  height: 400,
  width: 600,
  autostart: true,
  mute: true,
});

jwplayer('player').setPlaylistItemCallback((item, index) => {
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
		resolve();
	  });
	}); 
});
