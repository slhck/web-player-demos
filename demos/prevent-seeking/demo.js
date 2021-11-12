
jwplayer("player").setup({
  playlist: "https://cdn.jwplayer.com/v2/media/tkM1zvBq",
	autostart: true,
});

let maxSeekablePosition = 0;
let seeking = false;

jwplayer()
	.on("playlistItem", function () {
		console.log(`onPlaylistItem`);
		// initial start
		maxSeekablePosition = 0;
	})
	.on("levels", function (event) {
		// playlist levels have been loaded
		console.dir(event);
	})
	.on("bufferChange", function (event) {
    // buffer has increased, we can scroll up to this part
		console.log(`onBufferchange: ${JSON.stringify(event)}`);
		maxSeekablePosition = Math.max(event.duration, maxSeekablePosition);
		console.log(
			`maxSeekablePosition set to current buffer duration (${maxSeekablePosition})`
		);
	})
	.on("time", function (event) {
		console.log(`onTime: ${event.position}`);
		// player has progress
	})
	.on("seek", function (event) {
    // user is seeking
		console.log(`onSeek: ${JSON.stringify(event)}`);
		console.log(`maxSeekablePosition: ${maxSeekablePosition}`);
		if (!seeking) {
			if (event.offset > maxSeekablePosition) {
				seeking = true;
				setTimeout(function () {
          jwplayer().seek(maxSeekablePosition);
				}, 100);
			}
		} else seeking = false;
	});
