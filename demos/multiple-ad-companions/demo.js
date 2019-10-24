const playerInstance = jwplayer('player').setup({
  playlist: 'https://cdn.jwplayer.com/v2/media/ioyt59Zj',
  width: 567,
  height: 318,
  advertising: {
    tag: 'https://traffick.jivox.com/jivox/serverAPIs/getCampaignById.php?api=vast&version=2.0&siteId=94d5ae29c87442&campaignId=21411&r=__random-number__',
    client: 'vast'
  }
});

playerInstance.on('adCompanions', function({ companions }) {
  const adBlocks = [...document.querySelectorAll('.ad')];
  for (const companion of companions) {
    const  { resource, click } = companion;
    const adElement = adBlocks.find(b => {
      return b.offsetWidth === companion.width && b.offsetHeight === companion.height;
    });
    if (adElement) {
      insertAd(adElement, resource, click);
    }
  }
});

function insertAd(adElement, resource, click) {
  // empty out any content present in the element
  while (adElement.hasChildNodes() === true) {
    adElement.removeChild(adElement.firstChild);
  }

  // create an anchor element and attach any attributes or events for the link
  const link = document.createElement('a');
  link.href = click;
  link.setAttribute('target', '_blank');

  // create an img element and set its src
  const img = document.createElement('img');
  img.src = resource;

  // Add the image to the link
  link.appendChild(img);

  // Add the link to the
  adElement.appendChild(link);
}
