const playerInstance = jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/q1fx20VZ',
  advertising: {
    client: 'vast',
    companiondiv: {
      id: 'adrectangle',
      height: 250,
      width: 300
    },
    schedule: 'assets/vmap.xml'
  },
  height: 333,
  width: 592
});

const highlight = document.getElementById('highlight');
const setWidth = w => highlight.style.width = `${w}px`;

playerInstance.on('time', e => {
  const { position } = e
  let width;

  if (position < 300) {
    width = 42 + position / 300 * 124;
  }

  if (position > 301 && position < 600) {
    width = 234 + (position - 300) / 300 * 124;
  }

  if (position > 601) {
    width = 426 + (position - 600) / 288 * 124;
  }

  setWidth(width);
});

jwplayer().on('adTime', ({ tag, position, sequence }) => {
  const tagType = tag.split('?')[1];
  let width = sequence * 22 + position / 10 * 22;

  console.log(tag, tagType);

  const midrolls = [146, 338];

  switch (tagType) {
    case 'mr1':
      width += 146;
      break;

      case 'mr2':
        width += 338;
        break;

    case 'pre':
      width = position / 30 * 40;
      break;

    case 'pst':
      width = 552 + position / 30 * 40;
      break;

    case 'default':
      width = 0;
  }

  setWidth(width);
});
