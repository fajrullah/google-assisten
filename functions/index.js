'use strict';

const functions = require('firebase-functions');
const {
    dialogflow,
    BasicCard,
    BrowseCarousel,
    BrowseCarouselItem,
    Button,
    Carousel,
    Image,
    LinkOutSuggestion,
    List,
    MediaObject,
    Suggestions,
    SimpleResponse,
    Table
} = require('actions-on-google');

const smart_hafiz = 'smart hafiz';
const hafiz_doll = 'hafiz doll';


// Constants for selected item responses
const PRODUCTS_RESPONSES = {
    [smart_hafiz]: 'Anda memilih Smart Hafiz',
    [hafiz_doll]: 'Anda memilih Hafiz Doll',
};

// Constants for list and carousel selection
const SELECTION_KEY_GOOGLE_ASSISTANT = 'googleAssistant';
const SELECTION_KEY_GOOGLE_PAY = 'googlePay';
const SELECTION_KEY_GOOGLE_PIXEL = 'googlePixel';
const SELECTION_KEY_GOOGLE_HOME = 'googleHome';

Constants for selected item responses
const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_GOOGLE_ASSISTANT]: 'Smart Hafiz',
  [SELECTION_KEY_GOOGLE_PAY]: 'You selected Google Pay!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected Google Pixel!',
  [SELECTION_KEY_GOOGLE_HOME]: 'You selected Google Home!',
};


const IMG_URL_AOG = 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png';
const IMG_URL_GOOGLE_PAY = 'https://storage.googleapis.com/actionsresources/logo_pay_64dp.png';
const IMG_URL_GOOGLE_PIXEL = "https://storage.googleapis.com/madebygoog/v1/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png";
const IMG_URL_GOOGLE_HOME = "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw";

const callFunction = require('./component/getEndingMessage');
const {
    SUGGEST,
    BOOK_NAME,
    intentSuggestions,
} = require('./component/getSuggestion');

// Create an app instance
const app = dialogflow()


// Start App
app.intent('start_app', (conv) => {
    const initMessage = "Assalamualaikum! Selamat datang dan selamat mendengarkan Al Quran dan Do'a Do'a. \n Surah atau do'a apa yang ingin anda dengarkan.?";
    return getMessageFromQuote(initMessage, conv, BOOK_NAME);
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

    } else if (quran === "annaas") {
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
    } else {
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


// Carousel
app.intent('carousel', (conv) => {
  conv.ask('This is an example of a carousel.');
  conv.ask(new Suggestions(intentSuggestions));
  conv.ask(new Carousel({
    items: {
      // Add the first item to the carousel
      [SELECTION_KEY_GOOGLE_ASSISTANT]: {
        synonyms: [
          'Assistant',
          'Google Assistant',
        ],
        title: 'Item #1',
        description: 'Description of Item #1',
        image: new Image({
          url: IMG_URL_AOG,
          alt: 'Google Assistant logo',
        }),
      },
      // Add the second item to the carousel
      [SELECTION_KEY_GOOGLE_PAY]: {
        synonyms: [
          'Transactions',
          'Google Payments',
      ],
        title: 'Item #2',
        description: 'Description of Item #2',
        image: new Image({
          url: IMG_URL_GOOGLE_PAY,
          alt: 'Google Pay logo',
        }),
      },
      // Add third item to the carousel
      [SELECTION_KEY_GOOGLE_PIXEL]: {
        synonyms: [
          'Pixel',
          'Google Pixel phone',
        ],
        title: 'Item #3',
        description: 'Description of Item #3',
        image: new Image({
          url: IMG_URL_GOOGLE_PIXEL,
          alt: 'Google Pixel phone',
        }),
      },
      // Add last item of the carousel
      [SELECTION_KEY_GOOGLE_HOME]: {
        title: 'Item #4',
        synonyms: [
          'Google Home',
        ],
        description: 'Description of Item #4',
        image: new Image({
          url: IMG_URL_GOOGLE_HOME,
          alt: 'Google Home',
        }),
      },
    },
  }));
});


// Handle list or carousel only
app.intent('item selected', (conv, params, option) => {
  let response = 'You did not select any item from the list or carousel';
  if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    response = SELECTED_ITEM_RESPONSES[option];
  } else {
    response = 'You selected an unknown item from the list or carousel';
  }
  conv.ask(response);
  conv.ask(new Suggestions(intentSuggestions));
});


// Start List Product
app.intent('quit_app', (conv) => {
    conv.ask('Kami menyediakan produk edukasi untuk anak yang dapat dilihat dibawah ini');
    conv.ask(new Suggestions(intentSuggestions));
    conv.ask(new List({  
        title: 'Produk Edukasi Anak Dari Alqolam',
        items: {
                // First Item
                title: 'Smart Hafiz',
                description: 'Smart Hafiz Deskripsi',
                image: new Image({
                    url: 'https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png',
                    alt: 'Google Assistant logo',
                }),
            // Add the second item to the list
                title: 'hafiz doll',
                description: 'hafiz doll bilingual description',
                image: new Image({
                    url: 'https://www.gstatic.com/images/branding/product/2x/pay_48dp.png',
                    alt: 'Google Pay logo',
                }),
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
        return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Maaf, Kami tidak mengerti maksud Anda, Apakah anda ingin mendengarkan murottal Alquran?"));
    } else if (conv.data.fallbackCount === 2) {
        return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Terdapat 114 Surah dalam Al-Quran, Surah apa yang ingin Anda dengarkan.?"));
    }
    return conv.close("Mohon maaf kami belum mengerti maksud Anda, Silahkan datang kembali.");
});
// End Intent Tidak Tau

function getMessageFromQuote(initMessage, conv, sugest) {
    return conv.ask(new Suggestions(sugest), new SimpleResponse(initMessage),
        new SimpleResponse({
            text: callFunction.getEndingMessageText(),
            speech: `<speak> ` + callFunction.getEndingMessage() + ` </speak>  `
        }));
}

// HTTP Cloud Function for Firebase handler
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);