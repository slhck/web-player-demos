function isUserAuthorized(item, index) {
	// Handle any asynchronous custom logic
	return new Promise((resolve, reject) => {
		// Simulated to skip second playlist item
		const shouldCancel = index === 1;
		resolve(shouldCancel);
	});
}

jwplayer().setPlaylistItemCallback(function(item, index) {
	return new Promise(function(resolve, reject) {
	  return isUserAuthorized(item, index).then(isAuthorized => {
		if (!isAuthorized) {
			reject();
		}
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
