/** Create references to the relevant DOM elements. */
const selectButton = document.getElementById('select-channels');
const channelInputs = {
  a: document.getElementById('channel-input-a'),
  b: document.getElementById('channel-input-b')
};
const statusMessages = document.querySelectorAll('.status-message');
const playerContainer = document.getElementById('player-container');

/**
 * How often we should be checking for an update to the live status.
 * 10 seconds is generally a good frequency, it is not useful to check more often.
 */
const UPDATE_FREQUENCY = 10 * 1e3;

/**
 * The code of the error which the player may raise if the livestream goes offline or finishes.
 */
const LIVESTREAM_COMPLETE_ERROR = 230001;

/**
 * The code of the error emitted by JW Player's HLS implementation if buffering stalls.
 * This may happen when a livestream (suddenly) finishes and no more segments are available to buffer.
 * In this case we'll switch back to VOD playback.
 */
const HLS_BUFFER_STALL_WARNING = 334001;

/**
 * The maximum number of times we'll try before giving up configuring a player.
 * @type {number}
 */
const MAX_RETRIES = 5;

/** A reference to the active playerInstance on the page if any. */
let playerInstance;

/**
 * An object which maps the identifiers 'a' (for channel A) and 'b' (for channel B) to user provided
 * channelIds for which we should be fetching updates.
 */
const channelIds = {};

/** The identifier of the current/last played event. */
let activeEventId;

/** The identifier of the channel that's active. */
let activeChannelId;

/** An id used by the setInterval()/clearInterval() functions in order to manage the update loop. */
let intervalId;

// Register an event listener for the selectButton.
selectButton.addEventListener('click', (event) => {
  event.preventDefault();
  // Stop polling, if we were.
  stopPolling();

  // Validate the provided channel ids and store them.
  let validIds = true;
  Object.entries(channelInputs).forEach((entry) => {
    const inputId = entry[0];
    const channelId = entry[1].value;

    if (!channelId.match(/[a-zA-Z0-9]{8}/)) {
      alert(`The provided Channel ID ${channelId} for channel input ${inputId.toUpperCase()} is not a valid Live Channels channel ID.`);
      validIds = false;
      return;
    }
    channelIds[inputId] = channelId;
  });

  // Start the update loop, if the provided channel ids are valid.
  if (validIds) {
    startPolling();
  }
});

/**
 * Starts polling for either one of the channels to become active when called.
 */
function startPolling() {
  if (!intervalId) {
    updateStatusMessages(`Waiting for Live Channel ${channelIds['a']} or ${channelIds['b']} to become active.`);
    // Make sure to execute this method every UPDATE_FREQUENCY milliseconds.
    intervalId = setInterval(checkChannelStatus, UPDATE_FREQUENCY);
    checkChannelStatus();
  }
}

/**
 * Returns whether any polling logic is currently active.
 *
 * @returns {boolean}
 */
function isPolling() {
  return intervalId !== undefined;
}

/**
 * When invoked stops polling for channel status updates.
 */
function stopPolling() {
  if (intervalId !== undefined) {
    intervalId = clearInterval(intervalId);
  }
}

/**
 * Periodically checks whether one of the specified live stream channels is available, and if it is, configures the player
 * to start playing it.
 */
function checkChannelStatus() {
  // Check the status for both of the provided channels.
  Object.values(channelIds).forEach((channelId) => {
    getChannelStatus(channelId).then((channelStatus) => {
      console.log(`Received channel status: %O for ${channelId}.`, channelStatus);

      // Check whether a player was instantiated while we were waiting for this promise to be resolved, or whether
      // the update loop that created this promise was terminated in the meantime.
      if (playerInstance !== undefined || !isPolling()) {
        // A player was instantiated, while we were attempting to fetch the channel status.
        return;
      }

      // Attempt to start playback for this channel.
      playChannel(channelId, channelStatus);
    }, (error) => {
      const retrySeconds = UPDATE_FREQUENCY / 1000;
      updateStatusMessages(`Unable to fetch the channel status for ${channelId}: ${error}, retrying in ${retrySeconds} seconds.`);
    });
  });
}

/**
 * Starts playback for the provided channel.
 *
 * @param channelId The id of the channel to start playback for.
 * @param channelStatus The status for the channel as returned by getChannelStatus.
 */
function playChannel(channelId, channelStatus) {
  if (channelStatus['status'] !== 'active') {
    return;
  }

  // Determine the id of the active event based on the returned status.
  const eventId = channelStatus['current_event'];
  activeChannelId = channelId;
  activeEventId = eventId;

  // Stop polling for channel statuses once we attempt to start playback.
  stopPolling();

  // Attempt to configure a player to play the live event stream associated with `eventId`.
  configurePlayer(eventId).catch((error) => {
    updateStatusMessages(`Failed to start live event stream playback for channel '${channelId}': ${error}`);
  });
}

/**
 * (Re-)configures the active playerInstance to play the live stream identified by eventId.
 */
async function configurePlayer(eventId) {
  // There may be a slight delay between the live stream becoming available, and its playlist to become available.
  // Therefore, we first attempt to fetch the playlist for the new live event, as soon as we have successfully fetched
  // a playlist, we will load it on the player and start playback of the live stream.
  let playlist;
  let attempts = 0;
  updateStatusMessages(`Fetching playlist for ${eventId}.`);
  while (!playlist) {
    try {
      playlist = await getPlaylist(eventId);
    } catch (e) {
      ++attempts;
      console.error(e);
      if (attempts >= MAX_RETRIES) {
        throw e;
      }
      // Retry with exponential backoff, i.e. first retry after 5, 10, 20, 40, 80 seconds
      // after which we ultimately give up.
      await sleep(2 ** (attempts - 1) * 5 * 1000);
    }
  }

  // Once a playlist is available, use it to configure the player.
  if (playerInstance === undefined) {
    playerInstance = jwplayer(playerContainer).setup({
      playlist: playlist.playlist
    });
    // Register event listeners on the newly created playerInstance.
    registerPlaybackEventListeners(playerInstance);
  } else {
    playerInstance.load(playlist.playlist);
  }

  // Start playback
  playerInstance.play();
  updateStatusMessages(`Playing live event stream with id '${activeEventId}' associated with channel '${activeChannelId}'.`);
}

/**
 * Queries the state for the currently inactive channel and attempts to failover playback to that channel.
 */
function attemptFailover() {
  if (isPolling() || activeEventId === undefined || activeChannelId === undefined) {
    // We can't perform a failover prior to starting playback.
    return;
  }

  // Determine the id of the inactive channel.
  const inactiveChannelId = Object.values(channelIds).filter(channelId => channelId !== activeChannelId);
  if (!inactiveChannelId) {
    console.error('Unable to failover to a secondary Live Channel: inactive channelId could not be determined');
    return;
  }

  // Fetch the status for the inactive channel.
  updateStatusMessages(`Attempting to failover playback to ${inactiveChannelId}.`);
  getChannelStatus(inactiveChannelId).then((channelStatus) => {
    console.log(`Received channel status: %O for ${inactiveChannelId}.`, channelStatus);
    if (channelStatus['status'] !== 'active') {
      updateStatusMessages(`Could not fail over to channel ${inactiveChannelId}: no active event.`);
      return;
    }
    playChannel(inactiveChannelId, channelStatus);
  }, (error) => {
    console.error(`Unable to failover to a secondary Live Channel: ${error}`);
  });
}

/**
 * Function invoked when playback has finished.
 */
function handleLivestreamFinished() {
  // Display a message that playback has finished.
  // For continuous channel playback one may start checking the status of a channel here again.
  playerInstance = playerInstance.remove();
  updateStatusMessages('Live event playback finished without errors.');
}

function registerPlaybackEventListeners(playerInstance) {
  // Register an event listener that triggers when the JW Player has finished playing all
  // elements in its playlist.
  playerInstance.on('playlistComplete', handleLivestreamFinished);

  // Register an event listener that triggers when the player emits an error.
  playerInstance.on('error', (error) => {
    if (error.code === LIVESTREAM_COMPLETE_ERROR) {
      // This error is emitted when the player fails to fill up its buffer, at this point playback has already
      // stalled, therefore we'll try to failover to the secondary stream.
      attemptFailover();
    }
  });

  // Register an event listener which listens for buffer warnings from the player.
  // We can use the warnings generated by the player to failover before the player enters an error state.
  playerInstance.on('warning', (warn) => {
    if (warn.code === HLS_BUFFER_STALL_WARNING) {
      // This warning may be emitted when the player failed to buffer more media.
      // In this case we'll trigger the failover logic in order to see if there is another channel
      // we can failover to.
      attemptFailover();
    }
  });

}


/**
 * Utility function to fetch a JSON document.
 * @param url
 */
async function fetchJSON(url, init) {
  return await fetch(url, init)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to fetch ${url}: ${response.statusText}`);
      }
      return response.json();
    });
}

/**
 * Fetches the current status of a Live Channel.
 * Returns a promise that will yield the status for a particular channel.
 *
 * @param channelId The channel to fetch the status for.
 */
function getChannelStatus(channelId) {
  return fetchJSON(`https://cdn.jwplayer.com/live/channels/${channelId}.json`);
}

/**
 * Fetches a JW Platform feed for a particular media item.
 *
 * @param mediaId The media id to fetch a single item playlist for.
 */
function getPlaylist(mediaId) {
  return fetchJSON(`https://cdn.jwplayer.com/v2/media/${mediaId}`, { cache: "no-cache" });
}

/**
 * A simple utility method which can be used to wait for some time between retries.
 *
 * @param ms The amount of milliseconds to wait between retries.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Utility function that updates the status messages in the DOM with the provided message.
 *
 * @param message The message to display.
 */
function updateStatusMessages(message) {
  statusMessages.forEach((statusElement) => statusElement.textContent = message);
}
