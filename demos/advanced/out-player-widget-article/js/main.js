jwplayer('widget-video-player').setup({
  playlist: "//content.jwplatform.com/v2/media/RDn7eg0o?recommendations_playlist_id=TV74h176",
     width: "100%",
     aspectratio: "16:9",
     displaytitle: false,
     displaydescription: false,
     image: "",
     related: {
        autoplaytimer: 10,
        displayMode: "shelfWidget",
        onclick: "link",
        oncomplete: "autoplay"
       },
     autostart: false,
     stretching: "uniform"
});
