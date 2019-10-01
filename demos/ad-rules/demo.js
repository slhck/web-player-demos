const startOn = document.getElementById('startOn');
const frequency = document.getElementById('frequency');

const playerInstance = jwplayer('player');
function setupPlayer(startOnValue, frequencyValue) {
  playerInstance.setup({
    playlist: 'https://cdn.jwplayer.com/v2/playlists/JGKehvy1',
    advertising: {
      client: 'vast',
      tag: 'preroll.xml',
      rules: {
        startOn: startOnValue,
        frequency: frequencyValue
      }
    }
  });
}

const strings = {
  startOnText: [ 'first', 'second', 'third', 'fourth' ],
  frequencyText: [ 'single', 'other', 'third' ],
  noFrequencyText: 'Because the <span>frequency</span> ad rule is set to <span>0</span>, the ad will only play before the first playlist item. It will not play on subsequent playlist items. The value for <span>startOn</span> has no effect.',
  explanation: (f, s) => `These rules will result in the player playing ads every <span>${f}</span> playlist item, starting with the <span>${s}</span>.`
};

const explanationText = document.getElementById('explanation');

function updateExplanation(startOnValue, frequencyValue) {
  if (!frequencyValue) {
    explanationText.innerHTML = strings.noFrequencyText;
    return;
  }

  let startOnText = strings.startOnText[startOnValue - 1];
  let frequencyText = strings.frequencyText[frequencyValue - 1];

  explanationText.innerHTML = strings.explanation(startOnText, frequencyText);
}

const setupPlayerButton = document.getElementById('setupPlayerButton');
setupPlayerButton.addEventListener('click', function(e) {
  e.preventDefault();
  const startOnValue = parseInt(startOn.options[startOn.selectedIndex].value, 10);
  const frequencyValue = parseInt(frequency.options[frequency.selectedIndex].value, 10);

  setupPlayer(startOnValue, frequencyValue);
  updateExplanation(startOnValue, frequencyValue);
});

window.onbeforeunload = function() {
  startOn.selectedIndex = 0;
  frequency.selectedIndex = 1;
};

setupPlayer(1, 1);
