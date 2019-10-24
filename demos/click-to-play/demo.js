var playerInstance;

const thumbs = document.querySelectorAll('.thumb');
function getThumbnails({ playlist }) {
  thumbs.forEach(function(thumb, i) {
    var video = playlist[i];
    var titleText = document.createElement('div');

    titleText.className = 'title-text';
    titleText.innerHTML = video.title;
    thumb.appendChild(titleText);
    thumb.setAttribute('id', video.mediaid + 1);
    thumb.style.backgroundImage = "url('" + video.image + "')";

    thumb.addEventListener('click', function(e) {
      handleActivePlayer(e, video);
    });
  })
}

// On click, destroy existing player, setup new player in target div
function handleActivePlayer({ target }, { mediaid }) {
  if (playerInstance) {
    playerInstance.remove();
  }
  thumbs.forEach(t => t.classList.remove('active'));
  target.classList.add('active');

  // Chain .play() onto player setup (rather than autostart: true)
  playerInstance = jwplayer(target.id).setup({
    playlist: `https://cdn.jwplayer.com/v2/media/${mediaid}`
  }).play();

  // Destroy the player and replace with thumbnail
  playerInstance.on('complete', () => {
    playerInstance.remove();
    playerInstance = null;
  });
}

fetch('https://cdn.jwplayer.com/v2/playlists/0FDAGB12').then(r => r.json()).then(getThumbnails);
