const file = 'assets/index.m3u8';

const defaults = {
  title: 'Unknown',
  artist: 'Unknown',
  imageUrl: 'assets/jwlogo.png'
}

function loadImage(src) {
  const imageDiv = document.getElementById('image');
  const imageLoader = document.createElement('img');
  imageLoader.addEventListener('load', () => imageDiv.src = imageLoader.src);
  imageLoader.src = src;
}

// Set up the player with an HLS stream that includes timed metadata
const playerInstance = jwplayer('player').setup({ file });

// When metadata is available, set the title, artist, and poster image for the
// elements we have on the page.
const titleDiv = document.getElementById('title');
const artistDiv = document.getElementById('artist');
playerInstance.on('meta', ({ metadata: { artist, title, url } = defaults }) => {
  titleDiv.textContent = title;
  artistDiv.textContent = artist;
  loadImage(url);
});

// Handle reset of player at end of content
playerInstance.on('error', function(e) {
  if (e.code === 230001) {
    playerInstance.load({ file });
  }
});
