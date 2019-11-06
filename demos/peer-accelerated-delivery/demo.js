jwplayer('demoplayer').setup({
  file: 'https://demo-vod.streamroot.io/index.m3u8',
  dnaConfig: {},
  hlsjsConfig: {
    maxBufferSize: 0,
    maxBufferLength: 40
  }
});

const contentHolder = document.querySelector('#streamroot-demo-holder .content-holder');
const graphs = contentHolder.querySelector('.graphs');
const warning = document.querySelector('#warning-not-compatible');
function hideSR() {
  contentHolder.style.justifyContent = 'center';
  graphs.style.display = 'none';
  warning.style.display = 'block';
}

function showSR() {
  graphs.style.display = 'inline-block';
}

let checks = 0;
function checkStreamroot() {
  if (Streamroot.instances.length > 0) {
    const thisInstance = Streamroot.instances[0];
    if (!thisInstance.dnaDownloadEnabled || !thisInstance.dnaUploadEnabled) {
      hideSR();
    } else {
      showSR();
    }
  } else if (checks < 5) {
    checks++;
    // So that graphs aren't removed before a user has navigated to a tab.
    requestAnimationFrame(function() {
      setTimeout(checkStreamroot, 500);
    });
  } else {
    hideSR();
  }
}

checkStreamroot();
