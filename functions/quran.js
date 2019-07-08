'use strict';

const {
  Image,
  MediaObject,
 } = require('actions-on-google');

app.intent('intent_murottal', (conv) => {
    const quran = conv.parameters['quran'].toLowerCase();
    if (quran === "alfatihah") {
               conv.ask("Murottal Surah Al-Fatihah"); // this Simple Response is necessary
               conv.ask(new MediaObject({
                name: 'Surah Al-Fatihah',
                url: 'https://alqolam.sgp1.digitaloceanspaces.com/Syikh%20Misyari%20Rasyid/001%20Al%20Faatihah.mp3',
                description: 'Surah Al-Fatihah Ayat 1 - 7',
                icon: new Image({
                  url: 'https://alqolam.sgp1.digitaloceanspaces.com/Syikh%20Misyari%20Rasyid/title/00%20Surah%20title.png',
                  alt: 'Surah Al-Fatihah',
                }),
              }));
  
    }else if (quran === "annaas") {
        conv.ask("Murotal Surah An-Naas");
        conv.ask(new MediaObject({
          name: 'Surah An-Naas',
          url: 'https://alqolam.sgp1.digitaloceanspaces.com/Syikh%20Misyari%20Rasyid/004%20An%20Nisaa.mp3',
          description: 'A funky Jazz tune',
          icon: new Image({
            url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
            alt: 'Surah An-Naas',
          }),
        }));
    }else {
        conv.ask("Silahkan Pilih Surah")
  }
  });


module.exports = quran;
function newFunction() {
  return dialogflow();
}

