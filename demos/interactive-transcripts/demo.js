var chapters = [];
var captions = [];
var caption = -1;
var matches = [];
var query = "";
var cycle = -1;

const transcript = document.getElementById('transcript');
const search = document.getElementById('search');
const match = document.getElementById('match');

// Setup JW Player
jwplayer("player").setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/3p683El7',
  displaytitle: false,
  width: 640,
  height: 360
});

// Load chapters / captions
jwplayer().on('ready', function() {
  Promise.all([
    new Promise((resolve) => fetch('assets/captions.vtt').then(r => r.text()).then(t => resolve(t))),
    new Promise((resolve) => fetch('assets/chapters.vtt').then(r => r.text()).then(t => resolve(t))),
  ])
  .then(textData => textData.map(t => t.split('\n\n').splice(1).map(s => parse(s))))
  .then(parsedData => {
    captions = parsedData[0];
    chapters = parsedData[1];
    loadCaptions();
  });
});

function loadCaptions() {
  var h = "<p>";
  var section = 0;
  captions.forEach((caption, i) => {
    if (section < chapters.length && caption.begin > chapters[section].begin) {
      h += "</p><h4>"+chapters[section].text+"</h4><p>";
      section++;
    }
    h += `<span id="caption${i}">${caption.text}</span>`;
  });
  transcript.innerHTML = h + "</p>";
};

function parse(d) {
  var a = d.split('\n');
  var i = a[1].indexOf(' --> ');
  var t = a[2];
  if (a[3]) {  t += " " + a[3]; }
  t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return {
    begin: seconds(a[1].substr(0,i)),
    btext: a[1].substr(3,i-7),
    end: seconds(a[1].substr(i+5)),
    text: t
  }
}

function seconds(s) {
  var a = s.split(':');
  var r = Number(a[a.length - 1]) + Number(a[a.length - 2]) * 60;
  if (a.length > 2) {
    r += Number(a[a.length - 3]) * 3600;
  }
  return r;
}

// Highlight current caption and chapter
jwplayer().on('time', function(e) {
  var p = e.position;
  for(let j = 0; j<captions.length; j++) {
    if(captions[j].begin < p && captions[j].end > p) {
      if(j != caption) {
        var c = document.getElementById(`caption${j}`);
        if(caption > -1) {
          document.getElementById(`caption${caption}`).className = "";
        }
        c.className = "current";
        if(query == "") {
          transcript.scrollTop = c.offsetTop - transcript.offsetTop - 40;
        }
        caption = j;
      }
      break;
    }
  }
});

// Hook up interactivity
transcript.addEventListener('click', function(e) {
  if (e.target.id.indexOf('caption') === 0) {
    let i = Number(e.target.id.replace('caption', ''));
    jwplayer().seek(captions[i].begin);
  }
});

search.addEventListener('focus', () => setTimeout(() => search.select(), 100));

search.addEventListener('keydown', function(e) {
  switch (e.key) {
    case 'Escape':
    case 'Esc':
      resetSearch();
      break;

    case 'Enter':
      let q = this.value.toLowerCase();
      if (q.length) {
        if (q === query) {
          let thisCycle;
          if (e.shiftKey) {
            thisCycle = cycle <= 0 ? (matches.length - 1) : (cycle - 1);
          } else {
            thisCycle = (cycle >= matches.length - 1) ? 0 : (cycle + 1);
          }
          console.log(thisCycle);
          cycleSearch(thisCycle);
          return;
        }
        resetSearch();
        searchTranscript(q);
        return;
      }
      resetSearch();
      break;

    default:
      // none
  }
});

const sanitizeRegex = q => {
  return q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Execute search
function searchTranscript(q) {
  matches = [];
  query = q;
  captions.forEach(({ text }, loc) => {
    let matchSpot = text.toLowerCase().indexOf(q);
    if (matchSpot > -1) {
      const replacer = sanitizeRegex(q);
      document.getElementById(`caption${loc}`).innerHTML = text.replace(new RegExp(`(${replacer})`, 'gi'), `<em>$1</em>`, );
      matches.push(loc);
    }
  });
  if(matches.length) {
    cycleSearch(0);
  } else {
    resetSearch();
  }
};
function cycleSearch(i) {
  if (cycle > -1) {
    let o = document.getElementById(`caption${matches[cycle]}`);
    o.querySelector('em').classList.remove('current');
  }
  console.log(matches[i]);
  const c = document.getElementById(`caption${~~matches[i]}`);
  c.querySelector('em').classList.add('current');
  match.textContent = `${i + 1} of ${matches.length}`;
  transcript.scrollTop = c.offsetTop - transcript.offsetTop - 40;
  cycle = i;
};

function resetSearch() {
  if (matches.length) {
    captions.forEach((caption, i) => {
      document.getElementById(`caption${~~i}`).textContent = caption.text;
    });
  }

  query = "";
  matches = [];
  match.textContent = "0 of 0";
  cycle = -1;
  transcript.scrollTop = 0;
};
