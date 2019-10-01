const playerInstance = jwplayer('player');
const logger = new Logger('logger');

playerInstance.setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/i3q4gcBi',
  displaytitle: false,
  preload: 'metadata'
});

playerInstance.on('ready', function() {
  console.log(this.qoe());
  const setupTime = JSON.stringify(this.qoe().setupTime);
  logger.log(`The player set up in ${setupTime}ms.`);
});

playerInstance.on('firstFrame', function() {
  const firstFrame = JSON.stringify(this.qoe().firstFrame);
  logger.log(`The player took ${firstFrame}ms to get to the first video frame.`);
});

