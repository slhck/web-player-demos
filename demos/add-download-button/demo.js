// Set up the player
const playerInstance = jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/8L4m9FJB'
});

const buttonId = 'download-video-button';
const iconPath = 'assets/download.svg';
const tooltipText = 'Download Video';

// Call the player's `addButton` API method to add the custom button
playerInstance.addButton(iconPath, tooltipText, buttonClickAction, buttonId);

// This function is executed when the button is clicked
function buttonClickAction() {
  const playlistItem = playerInstance.getPlaylistItem();

  // Create an anchor element
  const anchor = document.createElement('a');

  // Set the anchor's `href` attribute to the media's file URL
  const fileUrl = playlistItem.file;
  anchor.setAttribute('href', fileUrl);

  // set the anchor's `download` attribute to the media's file name
  const downloadName = playlistItem.file.split('/').pop();
  anchor.setAttribute('download', downloadName);

  // Set the anchor's style to hide it when it's added to the page
  anchor.style.display = 'none';

  // Add the anchor to the page
  document.body.appendChild(anchor);

  // Trigger a click event to activate the anchor
  anchor.click();

  // Remove the anchor from the page, it's not needed anymore
  document.body.removeChild(anchor);
}
