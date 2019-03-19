(function (jwplayer) {
  'use strict';

  window.requestAnimationFrame = window.requestAnimationFrame // fallback
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) { return setTimeout(callback, 1000 / 60); }

  jwplayer('demoplayer')
    .setup({
      playlist: [{
        file: 'https://demo-vod.streamroot.io/index.m3u8'
      }],
      dnaConfig: {},
      hlsjsConfig: {
        maxBufferSize: 0,
        maxBufferLength: 40
      }
    });

  function showSR() {
    document.querySelector('#streamroot-demo-holder .content-holder .graphs').setAttribute('style', 'display:inline-block');
  }

  function hideSR() {
    document.querySelector('#streamroot-demo-holder .content-holder').setAttribute('style', 'justify-content: center;');
    document.querySelector('#streamroot-demo-holder .content-holder .graphs').setAttribute('style', 'display:none');
    document.querySelector('#warning-not-compatible').setAttribute('style', 'display:block');
  }

  var checks = 0;
  (function checkStreamroot() {
    if (Streamroot.instances.length > 0) {
      if (!Streamroot.instances[0].dnaDownloadEnabled || !Streamroot.instances[0].dnaUploadEnabled) {
        hideSR();
      } else {
        showSR();
      }
    } else if (checks < 5) {
      checks++;
      // So that graphs aren't removed before a user has navigated to a tab.
      window.requestAnimationFrame(function() {
        setTimeout(checkStreamroot, 500);
      });
    } else {
      hideSR();
    }
  })()

})(jwplayer);
