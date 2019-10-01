const logger = new Logger('logger');

const playerInstance = jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/1g8jjku3?sources=mp4'
});

playerInstance.once('play', function() {
  let cookieData = Cookies.get('resumevideodata');
  if (!cookieData) {
    return logger.log('No video resume cookie detected. Refresh page.');
  }
  const [ resumeAt, duration ] = cookieData.split(':');

  if (resumeAt < duration) {
    playerInstance.seek(resumeAt);
    logger.log('Resuming at ' + resumeAt);
    return;
  }

  logger.log('Video ended last time! Will skip resume behavior');
});

playerInstance.on('time', function(e) {
  Cookies.set('resumevideodata', `${Math.floor(e.position)}:${playerInstance.getDuration()}`);
});
