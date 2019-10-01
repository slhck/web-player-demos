let playlists = [
  'iLwfYW2S',
  'pVI22mfa',
  '8TbJTFy5',
  [
    'RDn7eg0o',
    'tkM1zvBq',
    'i3q4gcBi'
  ]
];

const apiUrl = mediaid => `https://cdn.jwplayer.com/v2/media/${mediaid}`;

playlists = playlists.map(playlist => {
  if (typeof playlist === 'string') {
    return apiUrl(playlist);
  }

  // To build a complete playlist, this demo fetches the full JW Delivery API
  // responses for each media id.
  const fetches = playlist.map(item => fetch(apiUrl(item)).then(r => r.json()));
  return Promise.all(fetches).then(media => media.flatMap(m => m.playlist));
});

Promise.all(playlists).then(playlists => {
  const select = document.getElementById('playlist-picker');

  const playerInstance = jwplayer('player').setup({
    playlist: playlists[0]
  });

  select.addEventListener('change', () => {
    playerInstance.load(playlists[select.selectedIndex]);
  });
});

/*
  A simpler approach would only need to be an array
  of objects containing a `file` property, like this:

    [
      { file: https://cdn.jwplayer.com/manifests/RDn7eg0o.m3u8 },
      { file: https://cdn.jwplayer.com/manifests/tkM1zvBq.m3u8 },
      { file: https://cdn.jwplayer.com/manifests/i3q4gcBi.m3u8 }
    ]

  The main benefit to fetching the sources is that we get all of the other
  information provided by JW Platform like poster images, thumbnails, captions,
  and sources.
*/
