'use strict';

const queueContainer = document.querySelector('.queue__container');
const container = document.querySelector('.chosen-playlist__container');
const title = document.querySelector('.chosen-playlist__title');
const sortable = document.querySelector('#sortable1')
const videoCont = document.querySelector('.chosen-playlist__container')
const nowPlayingButton = '<svg class="chosen-playlist__add" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-play"><path d="M20.11 10.34l-12-8A2 2 0 0 0 5 4v16a2 2 0 0 0 3.11 1.66l12-8a2 2 0 0 0 0-3.32z"/></svg> Now Playing'

let chosenPlaylist = {};
let queue = [];
let playing = [];
var selected;
let mainPlayer;
let playlistUrls = [
  "https://cdn.jwplayer.com/v2/playlists/0FDAGB12",
  "https://cdn.jwplayer.com/v2/playlists/dcrdWciC",
  "https://cdn.jwplayer.com/v2/playlists/f49AJ8N4"
];


// Loops thru playlist urls and fetches data. Each playlist calls the following functions.
for (let i = 0; i < playlistUrls.length; i++) {
  fetch(`${playlistUrls[i]}`).
    then(resp => resp.json()).
    then(data => {
      createPlaylistList(data)
      if (i === 0) {
        updatePlaylist(data)
        addVideoToQueue(data.playlist[0])
        addVideoToNowPlaying(data.playlist[0])
        updatedAddToNowPlaying()
      }
    })
}

// Puts a playlist's title and # of videos on the DOM
function createPlaylistList(playlistData) {
  const playlistContainer = document.querySelector('.playlists__container');
  const container = document.createElement('div');
  const h3 = document.createElement('h3');
  const p = document.createElement('span');

  container.classList.add('playlists__playlist');
  h3.classList.add('heading-tertiary', 'clickable');
  p.classList.add('playlists__text');

  h3.innerText = `${playlistData.title}`;
  p.innerText = `${playlistData.playlist.length} videos`;

  playlistContainer.append(container);
  container.append(h3, p);

  h3.addEventListener('click', function() {
    updatePlaylist(playlistData);
  })
}


// Updates 'Add to Queue' button to 'Now Playing'
function updatedAddToNowPlaying() {
  const cont = document.querySelector('.chosen-playlist__container');
  let textCont = document.querySelector('.chosen-playlist__text-cont');
  const div = document.createElement('div');
  div.classList.add('chosen-playlist__alternate-button');
  cont.firstElementChild.querySelector('img').classList.add('image-selected');
  cont.firstElementChild.querySelector('.heading-tertiary').classList.add('selected');
  const button = cont.firstElementChild.querySelector('.chosen-playlist__button');
  button.remove();
  textCont.append(div);
  div.innerHTML = nowPlayingButton;
}


// Puts new video playing onto the DOM under 'now playing'
function addVideoToNowPlaying(video) {
  const div1 = document.querySelector('.now-playing__item--1')
  const div2 = document.querySelector('.now-playing__item--2')
  const image = div1.querySelector('.now-playing__image')
  const title = div1.querySelector('.now-playing__text')
  const duration = div2.querySelector('.now-playing__text')

  let time = convertDuration(video.duration)
  image.src = video.image
  title.innerText = video.title
  duration.innerText = time
}


// Converts duration into new format
function convertDuration(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration - minutes * 60
  minutes.toString().length === 1 ? minutes = `0${minutes}` : minutes = minutes
  seconds.toString().length === 1 ? seconds = `${seconds}0` : seconds = seconds
  let time = `${minutes}:${seconds}`
  return time
}


// Listener for h3 (element's title). Loops thru playlist items & calls createPlaylistVideoItems
function updatePlaylist(playlist) {
  if (chosenPlaylist !== playlist) {
    chosenPlaylist = playlist;
    container.innerHTML = "";
    title.innerText = playlist.title;

    for (let i = 0; i < playlist.playlist.length; i++) {
      createPlaylistVideoItems(playlist.playlist[i], container);
    }
  }
}


// Updates DOM to show all video images & titles. Can click 'add to playlist'
function createPlaylistVideoItems(playlist, container) {
  const div = document.createElement('div');
  const image = document.createElement('img');
  const h3 = document.createElement('h3');
  const textContainer = document.createElement('div');

  div.classList.add('chosen-playlist__video-cont');
  image.classList.add('chosen-playlist__image');
  h3.classList.add('heading-tertiary', 'playlist-title');
  textContainer.classList.add('chosen-playlist__text-cont');

  h3.textContent = playlist.title;
  image.src = playlist.image;

  container.append(div);
  div.append(image, textContainer);
  textContainer.append(h3);

  if (queue.includes(playlist)) {
      const div = document.createElement('div');
      image.classList.add('image-selected');
      h3.classList.add('selected');
      div.innerHTML = '<svg class="check-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-checkmark"><path d="M9 20h-.09a2 2 0 0 1-1.48-.71l-5-5.9a2 2 0 1 1 3.06-2.57L9 15l9.53-10.35a2 2 0 0 1 2.94 2.7l-11 12A2 2 0 0 1 9 20z"/></svg> Queued'
      div.classList.add('chosen-playlist__alternate-button');
      textContainer.append(div);
  } else if (playing.includes(playlist)) {
      const div = document.createElement('div');
      image.classList.add('image-selected');
      h3.classList.add('selected');
      div.innerHTML = nowPlayingButton;
      div.classList.add('chosen-playlist__alternate-button');
      textContainer.append(div);
  } else {
      createAddToQueueButton (playlist, textContainer);
  }
}


// Created new 'Add to Queue' button with event listener
function createAddToQueueButton (playlist, container) {
  const button = document.createElement('button');
  button.classList.add('chosen-playlist__button');
  button.innerHTML += '<svg class="chosen-playlist__add" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-add"><path d="M20 10h-6V4a2 2 0 0 0-4 0v6H4a2 2 0 0 0 0 4h6v6a2 2 0 0 0 4 0v-6h6a2 2 0 0 0 0-4z"/></svg> Add to Queue'
  container.append(button);

  button.addEventListener('click', function(e) {
    addVideoToQueue(playlist);
    updateAddToQueued(e, playlist)
  })
}


// Updates 'Add to Queue' button to div with 'Queued'
function updateAddToQueued(e, playlist) {
  const div = document.createElement('div')
  e.target.parentElement.append(div)
  let image = e.target.parentElement.parentElement.querySelector('img')
  let title = e.target.parentElement.querySelector('h3')
  e.target.remove()
  div.classList.add('chosen-playlist__alternate-button')
  div.innerHTML = '<svg class="check-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-checkmark"><path d="M9 20h-.09a2 2 0 0 1-1.48-.71l-5-5.9a2 2 0 1 1 3.06-2.57L9 15l9.53-10.35a2 2 0 0 1 2.94 2.7l-11 12A2 2 0 0 1 9 20z"/></svg> Queued'

  title.classList.add('selected')
  image.classList.add('image-selected')
}


// Listener for 'Add to queue' button. Pushes video object queue. Creates new player for 1st queue item.
function addVideoToQueue(playlist) {
  let found = queue.find(obj => obj === playlist);
  if (playing.length === 0) {
    playing.push(playlist);
    createPlayer(playing);
  } else if (found === undefined && playing[0] !== playlist) {
    queue.push(playlist);
    addVideoToDom(playlist);
  }
}


// Creates a new player setup with the first item in the queue. Adds event listener to player.
function createPlayer(list){
  let video = list[0];
  mainPlayer = jwplayer("player").setup({
    playlist: [{
      file: video.sources[0].file,
      image: video.image,
      title: video.title,
      description: video.description,
    }],
    autostart: true
  });
  mainPlayer.on('complete', handleNextVideo);
  mainPlayer.on('fullscreen', handleFullScreen)
}


function handleFullScreen({ fullscreen: isFullscreen }) {
  if (isFullscreen) {
    const player = document.querySelector('#player')
    const overlay = player.querySelector('.jw-overlays')
    const div = document.createElement('div')
    div.classList.add('queue-overlay-fullscreen')
    div.innerHTML = '<div id="menuToggle"><input type="checkbox" /><span></span><span></span><span></span><ul id="menu"></ul></div>'
    overlay.append(div)

    for (let i = 0; i < queue.length; i++) {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const li = document.createElement('li');
      const image = document.createElement('img');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');
      const cross = document.createElement('div');
      const overlay = document.createElement('div');
      const container = document.createElement('div');

      li.id = queue[i].title;

      li.classList.add('queue__item');
      div1.classList.add('queue__item--1');
      div2.classList.add('queue__item--2')
      image.classList.add('queue__image');
      h3.classList.add('queue__item--heading', 'no-margin');
      p.classList.add('queue__text');
      cross.classList.add('queue__cross');
      overlay.classList.add('middle');
      container.classList.add('container');

      let time = convertDuration(queue[i].duration);

      image.src = queue[i].image;
      h3.innerText = queue[i].title;
      p.innerText = time;

      let menu = document.querySelector('#menu')

      menu.append(li)
      li.append(div1, div2);
      div1.append(container, h3);
      container.append(image, overlay);
      div2.append(p, cross);

      cross.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-cross"><path d="M14.83 12l6.58-6.59a2 2 0 0 0-2.82-2.82L12 9.17 5.41 2.59a2 2 0 0 0-2.82 2.82L9.17 12l-6.58 6.59a2 2 0 1 0 2.82 2.82L12 14.83l6.59 6.58a2 2 0 0 0 2.82-2.82z"/></svg>';
      overlay.innerHTML += '<svg class="text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-play"><path d="M20.11 10.34l-12-8A2 2 0 0 0 5 4v16a2 2 0 0 0 3.11 1.66l12-8a2 2 0 0 0 0-3.32z"/></svg>';

      image.addEventListener('click', function(e) {
        immediatelyPlayClickedFullScreen (e, queue[i])
      })
      overlay.addEventListener('click', function(e) {
        immediatelyPlayClickedFullScreen (e, queue[i])
      })
      cross.addEventListener('click', function(e) {
        removeFromQueueFullScreen(e, queue[i]);
      })
    }
  } else {
    const div = document.querySelector('.queue-overlay-fullscreen')
    div.remove()
  }
}


function removeFromQueueFullScreen (e, playlist) {
  queue = queue.filter(obj => obj !== playlist);
  e.target.closest('li').remove()
  let queueList = document.querySelector('#sortable1')
  let listItem = document.getElementById(playlist.title);
  listItem.remove()

  let index = chosenPlaylist.playlist.findIndex(obj => obj === playlist)
  if (index !== -1 ) {
    let chosen = videoCont.childNodes[index]
    let div = chosen.querySelector('.chosen-playlist__alternate-button')
    let cont = chosen.querySelector('.chosen-playlist__text-cont')
    div.remove()
    removeClasses(chosen)
    createAddToQueueButton (playlist, cont)
  }
}

// Runs when video is complete. Removes first queue item from DOM and updates queue & playing array.
function handleNextVideo(){
  handleOldPlay()
  handleNewPlay()

  if (jwplayer().getFullscreen()) {
    let queueItemContainer = document.querySelector('#menu')
    queueItemContainer.firstElementChild.remove()
  }
}


// Handles old video after complete
function handleOldPlay () {
  let oldPlaying = playing.shift();
  changePlayingToAdd(oldPlaying)
}


// Handles next video once old video is complete
function handleNewPlay () {
  let removed = queue.shift()
  playing.push(removed)
  loadPlayer(playing)
  addVideoToNowPlaying(playing[0])
  sortable.firstElementChild.remove();
  changeQueuedToPlaying(removed)
}

function loadPlayer (list) {
  let video = list[0];
  mainPlayer.load({
    file: video.sources[0].file,
    image: video.image,
    title: video.title,
    description: video.description,
    autostart: false
  });
}


// Updated 'Now Playing' to 'Add to Queue' when video is done playing
function changePlayingToAdd (playlist) {
  let index = chosenPlaylist.playlist.findIndex(obj => obj === playlist)
  if (index !== -1 ) {
    let chosen = videoCont.childNodes[index]
    let textCont = chosen.querySelector('.chosen-playlist__text-cont')
    removeClasses(chosen)
    textCont.querySelector('div').remove()
    createAddToQueueButton (playlist, textCont)
  }
}


// Removes selected classes from the h3 and images in chosen playlist
function removeClasses(chosen) {
  let image = chosen.querySelector('.chosen-playlist__image')
  let h3 = chosen.querySelector('.heading-tertiary')
  image.classList.remove('image-selected')
  h3.classList.remove('selected')
}


// Updates 'Queued' to 'Now Playing' when new video starts
function changeQueuedToPlaying (playlist) {
  let index = chosenPlaylist.playlist.findIndex(obj => obj === playlist)
  if (index !== -1 ) {
    let svg = '<svg class="chosen-playlist__add" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-play"><path d="M20.11 10.34l-12-8A2 2 0 0 0 5 4v16a2 2 0 0 0 3.11 1.66l12-8a2 2 0 0 0 0-3.32z"/></svg> Now Playing'
    videoCont.childNodes[index].querySelector('.chosen-playlist__alternate-button').innerHTML = svg
  }
}


// Adds new queue item to the DOM. Event Listener added to the 'x'
function addVideoToDom(playlist) {
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');
  const li = document.createElement('li');
  const image = document.createElement('img');
  const h3 = document.createElement('h3');
  const p = document.createElement('span');
  const selector = document.createElement('div');
  const cross = document.createElement('div');
  const overlay = document.createElement('div');
  const container = document.createElement('div');

  li.id = playlist.title;

  li.classList.add('queue__item');
  div1.classList.add('queue__item--1');
  div2.classList.add('queue__item--2')
  image.classList.add('queue__image');
  h3.classList.add('queue__item--heading', 'no-margin');
  p.classList.add('queue__text');
  selector.classList.add('queue__selector');
  cross.classList.add('queue__cross');
  overlay.classList.add('middle');
  container.classList.add('container');

  let time = convertDuration(playlist.duration);

  image.src = playlist.image;
  h3.innerText = playlist.title;
  p.innerText = time;

  sortable.append(li);
  li.append(div1, div2);
  div1.append(selector, container, h3);
  container.append(image, overlay);
  div2.append(p, cross);

  selector.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-drag"><path d="M20.5 22h-17a1.5 1.5 0 0 1 0-3h17a1.5 1.5 0 0 1 0 3zM18.5 13.61h-13a1.5 1.5 0 0 1 0-3h13a1.5 1.5 0 0 1 0 3zM20.5 5h-17a1.5 1.5 0 0 1 0-3h17a1.5 1.5 0 0 1 0 3z"/></svg>';
  cross.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-cross"><path d="M14.83 12l6.58-6.59a2 2 0 0 0-2.82-2.82L12 9.17 5.41 2.59a2 2 0 0 0-2.82 2.82L9.17 12l-6.58 6.59a2 2 0 1 0 2.82 2.82L12 14.83l6.59 6.58a2 2 0 0 0 2.82-2.82z"/></svg>';
  overlay.innerHTML += '<svg class="text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-play"><path d="M20.11 10.34l-12-8A2 2 0 0 0 5 4v16a2 2 0 0 0 3.11 1.66l12-8a2 2 0 0 0 0-3.32z"/></svg>';

  image.addEventListener('click', function(e) {
    immediatelyPlayClicked (e, playlist)
  })
  overlay.addEventListener('click', function(e) {
    immediatelyPlayClicked (e, playlist)
  })
  cross.addEventListener('click', function(e) {
    removeItemFromQueue(e, playlist);
  })
}


// Listener for 'x' to remove the video item from the queue & from DOM
function removeItemFromQueue(e, playlist) {
  queue = queue.filter(obj => obj !== playlist);
  e.target.closest('li').remove()
  updateQueuedToAdd(playlist)
}


// Updated Text in chosen playlist from queued to 'add to queue' when clicking the 'x'
function updateQueuedToAdd(playlist) {
  let index = chosenPlaylist.playlist.findIndex(obj => obj === playlist)
  if (index !== -1 ) {
    let chosen = videoCont.childNodes[index]
    let div = chosen.querySelector('.chosen-playlist__alternate-button')
    let cont = chosen.querySelector('.chosen-playlist__text-cont')
    div.remove()
    removeClasses(chosen)
    createAddToQueueButton (playlist, cont)
  }
}


// Function when clicking on queue item image to immediately switch and play new video
function immediatelyPlayClicked (e, playlist) {
  let removed = queue.filter(obj => obj === playlist);
  queue = queue.filter(obj => obj !== playlist);
  playing.shift();
  playing.push(removed[0]);
  loadPlayer(playing)
  addVideoToNowPlaying(playing[0]);
  e.target.closest('li').remove();
}


function immediatelyPlayClickedFullScreen (e, playlist) {
  let removed = queue.filter(obj => obj === playlist);
  queue = queue.filter(obj => obj !== playlist);
  playing.shift();
  playing.push(removed[0]);
  loadPlayer(playing)
  addVideoToNowPlaying(playing[0]);
  e.target.closest('li').remove();
  let queueList = document.querySelector('#sortable1')
  let item = document.getElementById(playlist.title);
  item.remove()
}


// Handles drag and drop events. When item is dropped, rearranges order of the queue.
$( "#sortable1" ).sortable({
  connectWith: ".connectedSortable",
  handle: ".queue__selector",
  stop: function(event, ui) {
    $('.connectedSortable').each(function() {
      let array = $(this).sortable("toArray");
      let h3 = event.toElement.closest('li').id;
      let i = queue.findIndex(obj => obj.title === h3);
      let obj = queue.find(obj => obj.title === h3);
      let x = [...queue];
      x.splice(i,1);
      let foundIndex = array.findIndex(obj => obj === h3);
      x.splice(foundIndex, 0, obj);
      queue = x;
    });
  }
});
