'use strict';

const functions = require('firebase-functions');
const { dialogflow, BasicCard, BrowseCarousel, BrowseCarouselItem, Button, Carousel, Image, LinkOutSuggestion, List, MediaObject, Suggestions, SimpleResponse, Table } = require('actions-on-google');

const smart_hafiz = 'smarthafiz';
const hafiz_doll = 'hafizdoll';


// Constants for selected item responses
const PRODUCTS_RESPONSES = {
   [smart_hafiz] : 'Anda memilih Smart Hafiz',
   [hafiz_doll] : 'Anda memilih Hafiz Doll',
};

// require("./component/getEndingMessage");
// require("./component/getSuggestion");

const intentSuggestions = new Array(
    "Smart Hafiz",
    "Hafiz Doll",
    "Alquran Al-Fatih",
);

const BOOK_NAME = new Array(
    "Surah Alfatihah",
    "Surah Yasin",
);

// Create an app instance
const app = dialogflow()


// Start App
app.intent('start_app', (conv) => {
    const initMessage = "Assalamualaikum! Selamat datang dan selamat mendengarkan Al Quran dan Do'a Do'a. \n Surah atau do'a apa yang ingin anda dengarkan.?";
    return getMessageFromQuote(initMessage,conv,BOOK_NAME);
});

// Call Quran.js
// const quran = require('./quran');

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
      conv.ask(new Suggestions(BOOK_NAME));
  }else {
      conv.ask("Silahkan Pilih Surah")
}
});

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



// Start List Product
app.intent('quit_app', (conv) => {
  conv.ask('Kami menyediakan produk edukasi untuk anak yang dapat dilihat dibawah ini');
  conv.ask(new Suggestions(intentSuggestions));
  conv.ask(new List({
    title: 'Produk Edukasi Anak Dari Alqolam',
    items: {
      // Add the first item to the list
      [smart_hafiz] : {
        synonyms: [
          'Smart Hafiz',
          'smart hafiz',
        ],
        title: 'Smart Hafiz',
        description: 'Smart Hafiz Deskripsi',
        image: new Image({
          url: 'https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png',
          alt: 'Google Assistant logo',
        }),
      },
      // Add the second item to the list
       [hafiz_doll] : {
        synonyms: [
          'Hafiz Doll',
          'hafiz doll',
        ],
        title: 'hafiz doll',
        description: 'hafiz doll bilingual description',
        image: new Image({
          url: 'https://www.gstatic.com/images/branding/product/2x/pay_48dp.png',
          alt: 'Google Pay logo',
        }),
      },
    },
  }));

});
// End List Product

// Handle list or carousel selection
app.intent('pilih_produk', (conv, params, option) => {
  let response = 'Silahkan Pilih Produk';
  if (option && PRODUCTS_RESPONSES.hasOwnProperty(option)) {
    response = PRODUCTS_RESPONSES[option];
  } else {
    response = 'Terimakasih, silahkan kembali lagi apabila Anda tertarik dengan produk kami';
  }
  conv.ask(response);
  conv.ask(new Suggestions(intentSuggestions));
});

// Start Detail Product
app.intent('detail_product', (conv) => {
    const product_type = conv.parameters['product_type'].toLowerCase();
    if (product_type === "smart hafiz") {
        conv.ask("ini produk smart hafiz"); // this Simple Response is necessary
        conv.ask(new BasicCard({
            image: new Image({
                url: 'https://assets.alqolam.com/images/2019/04/08/5.jpg', //url of your image.
                alt: 'Smart Hafiz',
            }),
            title: 'Smart Hafiz',
            subtitle: 'Bermain & belajar bersama Smart Hafiz',
            text: 'Produk Edukasi Visual untuk anak meningkatkan kecerdasan motorik dan dapat belajar bersama smart hafiz',
            buttons: new Button({
                title: 'Selengkapnya',
                url: 'https://alqolam.com',
            }),
        }));
        conv.ask(new SimpleResponse({
            speech: 'Silahkan masukan email dan nomor telepon apabila anda tertarik dengan produk ini',
            text: 'Silahkan masukan email dan nomor telepon apabila anda tertarik dengan produk ini',
        }));

    } else if (product_type === "hafiz doll") {
        conv.ask("Ini Hafiz Doll");
        conv.ask(new BasicCard({
            image: new Image({
                url: 'https://assets.alqolam.com/images/2019/04/08/4.jpg', //url of your image.
                alt: 'Smart Hafiz',
            }),
        }));
    } else {
        conv.ask("Silahkan Pilih Produk")
    }
});
// End Detail Product

// Start Intent Tidak Tau
app.intent('Default Fallback Intent', (conv) => {
    console.log(conv.data.fallbackCount);
    if (typeof conv.data.fallbackCount !== 'number') {
        conv.data.fallbackCount = 0;
    }
    conv.data.fallbackCount++;
    // Provide two prompts before ending game
    if (conv.data.fallbackCount === 1) {
        return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Apakah Anda ingin mendengarkan Al-Quran.?? Surat Aapa yang ingin anda dengar?"));
    } else if (conv.data.fallbackCount === 2) {
        return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Selamat datang di Him Speaking, Berbagi Kata kata mutiara dengan Him Speak, Selamat mendengarkan"));
    }
    return conv.close("Saya tidak mengerti, Semoga hari Anda Menyenangkan");
});
// End Intent Tidak Tau

function getEndingMessageText() {
    return `Apakah anda ingin mendengarkan kata kata mutiara yang lain?`;
}

function getEndingMessage() {
    return `  <audio src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" clipBegin="10s" clipEnd="13s">Consider the quote!</audio>`;
}

function getMessageFromQuote(initMessage, conv, sugest) {
    return conv.ask(new Suggestions(sugest), new SimpleResponse(initMessage),
        new SimpleResponse({
            text: getEndingMessageText(),
            speech: `<speak> ` + getEndingMessage() + ` </speak>  `
        }));
}

// HTTP Cloud Function for Firebase handler
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);