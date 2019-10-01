const apiRoute = 'https://cdn.jwplayer.com/v2/media';

const players = [
  '1b02B03R',
  'kbs0WLBI',
  'KJKBQC7h'
].map((m, i) => {
  const playlist = `${apiRoute}/${m}`;
  const player = jwplayer(`player${i}`).setup({ playlist })
  player.on('play', () => pausePlayers(i));
  return player;
});

function pausePlayers(playing) {
  players.filter((p, i) => i !== playing).forEach(p => p.pause(true));
};
