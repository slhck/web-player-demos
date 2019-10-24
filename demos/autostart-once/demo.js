const storageKey = 'jwplayer.page-reloaded';

let shouldAutostart = true;
const wasReloaded = JSON.parse(localStorage.getItem(storageKey));
if (wasReloaded) {
  shouldAutostart = false;
}

jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/tkM1zvBq',
  // Do not autostart if the page was reloaded.
  autostart: shouldAutostart
});

localStorage.setItem(storageKey, true);

const refreshBtn = document.querySelector('.refresh');
refreshBtn.addEventListener('click', () => window.location.reload());

const clearStorageBtn = document.querySelector('.clear-storage');
clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  refreshBtn.click();
});
