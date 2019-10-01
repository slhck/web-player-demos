const setupOptions = {
  width: 300,
  height: 300,
  stretching: 'fill',
  repeat: true,
  controls: false,
  autostart: true
};

const faces = document.querySelectorAll('.cube-face');

[...faces].forEach(face => {
  const faceId = face.getAttribute('id');
  const config = Object.assign({}, setupOptions, {
    playlist: `https://cdn.jwplayer.com/v2/media/${faceId}`
  });
  jwplayer(faceId).setup(config);
});
