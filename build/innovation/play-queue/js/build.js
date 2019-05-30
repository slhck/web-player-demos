'use strict';

const queueContainer = document.querySelector('.queue__container');
const container = document.querySelector('.chosen-playlist__container');
const title = document.querySelector('.chosen-playlist__title');
const sortable = document.querySelector('#sortable1')

let chosenPlaylist = {};
let queue = [];
let playing = [];
var selected;
let mainPlayer;
let playlistUrls = [
  "https://cdn.jwplayer.com/v2/playlists/dcrdWciC",
  "https://cdn.jwplayer.com/v2/playlists/0FDAGB12",
  "https://cdn.jwplayer.com/v2/playlists/f49AJ8N4"
];

// iterate over urls to fetch from each url & pass each fetch response to createPlaylistList which puts them on the DOM
for (let i = 0; i < playlistUrls.length; i++) {
  fetch(`${playlistUrls[i]}`).
    then(resp => resp.json()).
    then(data => {
      createPlaylistList(data)
      if (i === 0) {
        updatePlaylist(data)
        addVideoToQueue(data.playlist[0])
      }
    })
}

// Puts a playlist's title and # of videos on the DOM
function createPlaylistList(playlistData) {
  const playlistContainer = document.querySelector('.playlists__container');
  const container = document.createElement('div');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');

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

// Event listener for the h3 element of the playlist's title.
// Loops through each playlist item and calls createPlaylistVideoItems function
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
function createPlaylistVideoItems(playlist, container){
  const div = document.createElement('div');
  const image = document.createElement('img');
  const button = document.createElement('button');
  const h3 = document.createElement('h3');
  const textContainer = document.createElement('div');

  div.classList.add('chosen-playlist__video-cont');
  image.classList.add('chosen-playlist__image');
  button.classList.add('chosen-playlist__button');
  h3.classList.add('heading-tertiary', 'playlist-title');
  textContainer.classList.add('chosen-playlist__text-cont');

  h3.textContent = playlist.title;
  image.src = playlist.image;
  button.textContent = "+ Add to Queue";

  container.append(div);
  div.append(image, textContainer);
  textContainer.append(h3, button);

  button.addEventListener('click', function() {
    addVideoToQueue(playlist);
  })
}

// Event listener for 'Add to queue' button. Pushes video object into the queue.
// Creates new player for first video in the queue. Passes each video item to addVideoToDom function
function addVideoToQueue(playlist) {
  let found = queue.find(obj => obj === playlist);
  if (playing.length === 0) {
    playing.push(playlist);
    createPlayer(playing);
    console.log('in function')
  } else if (found === undefined) {
    queue.push(playlist);
    addVideoToDom(playlist);
  }
}

// Creates a new player setup with the first item in the queue. Adds event listener to player
function createPlayer(list){
  let video = list[0];
  mainPlayer = jwplayer("player").setup({
    file: video.sources[0].file,
    image: video.image,
    title: video.title,
    description: video.description,
    autostart: false
  });
  mainPlayer.on('complete', handleNextVideo);
}

// Player event when video is complete
// Removes first queue__item child of queue__container from the DOM
// Removes first element from queue array & passes new queue to createPlayer
function handleNextVideo(){
  playing.shift();
  let removed = queue.shift()
  playing.push(removed)
  createPlayer(playing);
  sortable.firstElementChild.remove();
}

// Adds new queue item to the DOM. Event Listener added to the 'x'
function addVideoToDom(playlist) {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const div3 = document.createElement('div');
  const div4 = document.createElement('div');
  const li = document.createElement('li');
  const image = document.createElement('img');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  const selector = document.createElement('div');
  const cross = document.createElement('div');

  li.id = playlist.title;

  div.classList.add('queue__item');
  div2.classList.add('queue__text-cont');
  div3.classList.add('title-container')
  div4.classList.add('secondary-container')
  image.classList.add('queue__image');
  h3.classList.add('heading-tertiary', 'no-margin');
  p.classList.add('queue__text');
  selector.classList.add('queue__selector');
  cross.classList.add('queue__cross');

  let minutes = Math.floor(playlist.duration / 60);
  let seconds = playlist.duration - minutes * 60
  minutes.toString().length === 1 ? minutes = `0${minutes}` : minutes = minutes
  seconds.toString().length === 1 ? seconds = `${seconds}0` : seconds = seconds
  let time = `${minutes}:${seconds}`

  image.src = playlist.image;
  h3.innerText = playlist.title;
  p.innerText = time;

  sortable.append(li);
  li.append(div);
  div.append(image, div2)
  div2.append(div3, div4);
  div3.append(h3)
  div4.append(p, selector, cross)

  selector.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-drag"><path d="M20.5 22h-17a1.5 1.5 0 0 1 0-3h17a1.5 1.5 0 0 1 0 3zM18.5 13.61h-13a1.5 1.5 0 0 1 0-3h13a1.5 1.5 0 0 1 0 3zM20.5 5h-17a1.5 1.5 0 0 1 0-3h17a1.5 1.5 0 0 1 0 3z"/></svg>'
  cross.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ds-icon-dashboard-cross"><path d="M14.83 12l6.58-6.59a2 2 0 0 0-2.82-2.82L12 9.17 5.41 2.59a2 2 0 0 0-2.82 2.82L9.17 12l-6.58 6.59a2 2 0 1 0 2.82 2.82L12 14.83l6.59 6.58a2 2 0 0 0 2.82-2.82z"/></svg>'
  cross.addEventListener('click', function(e) {
    removeItemFromQueue(e, playlist);
  })
}
// Event Listener for 'x' to remove the video item from the queue
// Removes video queue element from the DOM
function removeItemFromQueue(e, playlist) {
  queue = queue.filter(obj => obj !== playlist);
  e.target.closest('li').remove()
}

// Function to handle drag and drop events. When an item is dropped, rearranges the order of the queue.
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
