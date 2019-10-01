var spots = [];
var hotspots = document.getElementById('hotspots');
var seeking = false;
var player = jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/lKbBWWWf'
});

player.addButton('assets/toc.png', 'Table of Contents', () => jwplayer().seek(20), 'contents');

// Load chapters / captions
player.on('ready', function() {
  fetch('assets/hotspots.vtt').then(r => r.text()).then(rawText => {
    const splitText = rawText.split('\n\n');
    splitText.shift();
    spots = splitText.map(t => parseVTT(t)).filter(c => c.href);
  });
});

const parseVTT = d => {
  let a = d.split('\n');
  let t = a.shift();
  let i = t.indexOf(' --> ');
  let j = JSON.parse(a.join(''));
  return {
    begin: seconds(t.substr(0, i)),
    end: seconds(t.substr(i + 5)),
    href: j.href,
    left: Number(j.left.substr(0, j.left.length - 1)) / 100,
    top: Number(j.top.substr(0, j.top.length - 1)) / 100,
    show: false
  };
}

const seconds = s => {
  var a = s.split(':');
  var r = Number(a[a.length - 1]) + Number(a[a.length - 2]) * 60;
  if (a.length > 2) {
    r += Number(a[a.length - 3]) * 3600;
  }
  return r;
}

// Highlight active spots
player.on('time', ({ position }) => { if (!seeking) setSpots(position) });

player.on('seek', function() {
  seeking = true;
  setTimeout(() => seeking = false, 500);
});

const removeSpan = function() {
  hotspots.removeChild(this);
  this.removeEventListener('transitionend', arguments.callee);
};

function setSpots(p) {

  spots.forEach((spot, i) => {
    const spotId = `spot-${i}`;
    const transitionDelay = `${Math.random() * 800}ms`;

    if (spot.begin <= p && spot.end >= p) {
      if (!spot.show) {
        const span = document.createElement('span');
        span.style.left = `${(720 * spot.left) - 20}px`;
        span.style.top = `${(405 * spot.top) - 20}px`;
        span.id = spotId;
        span.style.transitionDelay = transitionDelay;
        hotspots.appendChild(span);
        void hotspots.clientWidth;
        span.style.transform = 'scale(1, 1)';
        spot.show = true;
        span.addEventListener('transitionend', function() {
          span.style.transitionDelay = '0ms';
          span.removeEventListener('transitionend', arguments.callee);
        });
      }
    } else if (spot.show) {
      const span = document.getElementById(spotId);
      span.style.transitionDelay = transitionDelay;
      span.style.transform = 'scale(0, 0)';
      span.addEventListener('transitionend', () => hotspots.removeChild(span));
      spot.show = false;
    }
  });
}

function popSpot(s) {
  var t = Math.round(Math.random() * 800);
  setTimeout(function() {
    s.style.transform = 'scale(1,1)';
    s.style.webkitTransform = 'scale(1,1)';
  }, t);
}

function dropSpot(s) {
  var t = Math.round(Math.random() * 400);
  setTimeout(function() {
    s.style.transform = 'scale(0,0)';
    s.style.webkitTransform = 'scale(0,0)';
  }, t);
  setTimeout(function() {
    hotspots.removeChild(s);
  }, t + 200);
}

// Hook up rolls and click
hotspots.addEventListener('click', function(e) {
  if (e.target.id.indexOf('spot-') === 0) {
    var s = spots[e.target.id.replace('spot-', '')];
    if (s.href.indexOf('#t=') == 0) {
      jwplayer().seek(s.href.substr(3));
    } else {
      window.open(s.href, '_blank');
      jwplayer().pause(true);
    }
  }
});

hotspots.addEventListener('mouseover', function(e) {
  if (e.target.id.indexOf('spot') == 0) {
    e.target.style.opacity = 1;
  }
});

hotspots.addEventListener('mouseout', function(e) {
  if (e.target.id.indexOf('spot') == 0) {
    e.target.style.opacity = 0.5;
  }
});
