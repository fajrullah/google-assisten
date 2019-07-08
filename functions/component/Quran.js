const functions = require('firebase-functions');
const { dialogflow, BasicCard, BrowseCarousel, BrowseCarouselItem, Button, Carousel, Image, LinkOutSuggestion, List, MediaObject, Suggestions, SimpleResponse, Table } = require('actions-on-google');

    // Quran Basic Card With Media Sample
app.intent('intent_murottal', (conv) => {
  const quran = conv.parameters['quran'].toLowerCase();
  if (quran === "alfatihah") {
    if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
      conv.close('Sorry, this device does not support audio playback.');
      return;
  }
             conv.ask("Murottal Surah Al-Fatihah"); // this Simple Response is necessary
             conv.ask(new MediaObject({
              name: 'Surah Al-Fatihah',
              url: 'https://alqolam.sgp1.digitaloceanspaces.com/Syikh%20Misyari%20Rasyid/001%20Al%20Faatihah.mp3',
              description: 'Surah Al-Fatihah Ayat 1 - 7',
              icon: new Image({
                url: 'https://assets.alqolam.com/images/2019/07/08/logo.png',
                alt: 'Surah An-Naas',
              }),
            }));
            conv.ask(new Suggestions(BOOK_NAME));

  }else if (quran === "annaas") {
      if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
        conv.close('Sorry, this device does not support audio playback.');
        return;
        }
        conv.ask("Murotal Surah An-Naas");
        conv.ask(new MediaObject({
        name: 'Surah An-Naas',
        url: 'https://alqolam.sgp1.digitaloceanspaces.com/Syikh%20Misyari%20Rasyid/004%20An%20Nisaa.mp3',
        description: 'A funky Jazz tune',
        icon: new Image({
          url: 'https://assets.alqolam.com/images/2019/07/08/logo.png',
          alt: 'Surah An-Naas',
        }),
      }));
  }else {
      conv.ask("Silahkan Pilih Surah")
}
}),

// Handle a media status event
app.intent('media status', (conv) => {
  const mediaStatus = conv.arguments.get('MEDIA_STATUS');
  let response = 'Unknown media status received.';
  if (mediaStatus && mediaStatus.status === 'FINISHED') {
    response = 'Hope you enjoyed the tunes!';
  }
  conv.ask(response);
  conv.ask(new Suggestions(BOOK_NAME));
});
