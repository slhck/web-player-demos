const playerInstance = jwplayer('player').setup({
    playlist: 'https://cdn.jwplayer.com/v2/media/l76Ij09F'
});

const resizeButton = document.getElementById('resize');
resizeButton.addEventListener('click', () => {
    if (playerInstance.getWidth() > 480) {
        playerInstance.resize(480, 270);
    } else {
        playerInstance.resize(640, 360);
    }
});
