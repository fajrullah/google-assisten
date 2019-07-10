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

const SMART_HAFIZ = 'smart hafiz';
const HAFIZ_DOLL = 'hafiz doll';
const MUSHAF_ALFATIH = 'alfatih';
const MUSHAF_MAQAMAT_KIDS = 'maqamat for kids';
const AUDIO_HAJI = 'Audio haji umrah';
const MUSHAF_WANITA = 'Mushaf wanita';

// Constant for image URLs
const IMG_SMART_HAFIZ = 'https://assets.alqolam.com/images/2019/07/09/new-smart-hafiz.jpg';
const IMG_HAFIZ_DOLL = 'https://assets.alqolam.com/images/2019/07/09/Hafiz-Doll-2018-Yellow.jpg';
const IMG_ALFATIH = 'https://assets.alqolam.com/images/2019/07/09/al-fatih-JPEG.jpg';
const IMG_MAQAMAT_KIDS = 'https://assets.alqolam.com/images/2019/07/09/maqamatforkids.jpg';
const IMG_MUSHAF_WOMAN = 'https://assets.alqolam.com/images/2019/07/09/mushaf-wanita-JPEG.jpg';
const IMG_HAJI_UMRAH = 'https://assets.alqolam.com/images/2019/07/09/Audio-Haji-Putih--Hitam-With-Box-2.jpg';

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


app.intent('quit_app', (conv) => {
  conv.ask('Kami menyediakan produk produk islami & edukasi yang dapat dilihat dibawah ini');
  // conv.ask(new Suggestions(intentSuggestions));
  conv.ask(new Carousel({
    items: {
      // #1
      [SMART_HAFIZ]: {
        synonyms: [
          'smart hafiz',
        ],
        title: 'Smart Hafiz',
        description: 'Mainan Visual Untuk Anak',
        image: new Image({
          url: IMG_SMART_HAFIZ,
          alt: 'Smart Hafiz',
        }),
      },
      // #2
      [HAFIZ_DOLL]: {
        synonyms: [
          'Hafiz doll',
      ],
        title: 'Hafiz Doll',
        description: 'Hafiz Hafizah Talking Doll',
        image: new Image({
          url: IMG_HAFIZ_DOLL,
          alt: 'Hafiz Talking Doll',
        }),
      },
      // #3
      [MUSHAF_ALFATIH]: {
        synonyms: [
          'alfatih',
      ],
        title: 'Mushaf Alfatih',
        description: 'Alquran Talking Pen Alfatih',
        image: new Image({
          url: IMG_ALFATIH,
          alt: 'Mushaf Alfatih',
        }),
      },
      // #4
      [MUSHAF_MAQAMAT_KIDS]: {
        synonyms: [
          'Maqamat kids',
      ],
        title: 'Maqamat For Kids',
        description: 'Alquran talking pen untuk anak anak',
        image: new Image({
          url: IMG_MAQAMAT_KIDS,
          alt: 'Maqamat For Kids',
        }),
      },
      // #5
      [AUDIO_HAJI]: {
        synonyms: [
          'audi haji',
      ],
        title: 'Mabrur Audio haji dan umrah',
        description: 'Audio Haji dan Umrah',
        image: new Image({
          url: IMG_HAJI_UMRAH,
          alt: 'Audio Haji dan Umrah',
        }),
      },
      // #6
      [MUSHAF_WANITA]: {
        synonyms: [
          'mushaf wanita',
      ],
        title: 'Mushaf wanita',
        description: 'Alquran Talking Pen khusus Wanita',
        image: new Image({
          url: IMG_MUSHAF_WOMAN,
          alt: 'Mushaf Wanita',
        }),
      },
    },
  }));
});

// Handle Produk
app.intent('get-option', (conv, _input, option) => {
  if (option === SMART_HAFIZ) {
    conv.ask("Smart Hafiz Mainan Edukasi Visual Untuk Anak"); // this Simple Response is necessary
        conv.ask(new BasicCard({
            image: new Image({
                url: IMG_SMART_HAFIZ, //url of your image.
                alt: 'Smart Hafiz',
            }),
            title: 'Smart Hafiz',
            subtitle: 'Bermain & belajar bersama Smart Hafiz',
            text: 'Smart Hafiz merupakan Inovasi terbaru dari Al Qolam , produk edukasi anak-anak Islami yang memiliki banyak sekali konten edukasi dan juga Fun. Dengan kualitas suara yang sangat baik, smart hafiz ini memiliki fitur karaoke untuk media anak mengaji dan bernyayi.',
            buttons: new Button({
                title: 'Klik Disini Untuk Pembelian',
                url: 'https://alqolam.com',
            }),
        }));
  } 
  else if (option === HAFIZ_DOLL) {
    conv.ask("Mainan Hafiz Hafizah Talking Doll"); // this Simple Response is necessary
        conv.ask(new BasicCard({
            image: new Image({
                url: IMG_HAFIZ_DOLL, //url of your image.
                alt: 'Hafiz Doll',
            }),
            title: 'Hafiz Hafizah Talking Doll',
            subtitle: 'Boneka edukasi untuk anak',
            text: 'Hafiz Hafizah Talking Doll adalah produk edukasi terbaru dari Al-Qolam yang menggunakan teknologi tinggi. Yang dapat di hubungkan dengan aplikasi Hafiz-Hafizah di Android yang bisa di download di Google Play, Icon anak soleh ini bisa mengajarkan banyak hal positif kepada anak-anak dengan cara menyenangkan dan tidak membosankan.',
            buttons: new Button({
                title: 'Klik Disini Untuk Pembelian',
                url: 'https://alqolam.com',
            }),
        }));
  }
  else if (option === MUSHAF_ALFATIH) {
    conv.ask("Alquran dengan talking pen Mushaf Alfatih"); // this Simple Response is necessary
        conv.ask(new BasicCard({
            image: new Image({
                url: IMG_ALFATIH, //url of your image.
                alt: 'Hafiz Doll',
            }),
            title: 'Alquran Talking Pen Al Fatih',
            subtitle: 'Baca alquran perkata dengan talking pen',
            text: 'Al Quran New Al Fatih Talking Pen, Memberikan nuansa yang sangat bervariasi dimana pembaca diberikan berbagai macam pilihan ilmu yang terkait dengan Al-Quran, Pembaca bisa mendengar langsung 1 halaman dengan satu klik, mendengar per ayat, bahkan kata per kata. Selain itu juga di sediakan terjemahan ayat, hukum tajwid yang lebih lengkap, Asbabun nuzul, Doa Doa, dan lain sebagainya.',
            buttons: new Button({
                title: 'Klik Disini Untuk Pembelian',
                url: 'https://alqolam.com',
            }),
        }));
  }
  else if (option === MUSHAF_WANITA) {
    conv.ask("Alquran talking pen Mushaf Wanita"); // this Simple Response is necessary
        conv.ask(new BasicCard({
            image: new Image({
                url: IMG_MUSHAF_WOMAN, //url of your image.
                alt: 'Mushaf Wanita',
            }),
            title: 'Alquran Talking Pen Mushaf Wanita',
            subtitle: 'Alquran talking pen yang dilengkapi dengan fitu fitur wanita',
            text: 'Al Quran Digital Talking Pen Mushaf Al-Qolam For Woman merupakan produk terbaru dari Al-Qolam, yang di keluarkan khusus dengan fitur fitur wanita \n Seperti produk produk Al Qolam terdahulu Al Quran Mushaf Al-Qolam For Women ini dilengkapi dengan Talking Pen dengan Teknologi tinggi, Talking Pen ini dapat digunakan membantu pembaca belajar Al Quran lebih mudah.',
            buttons: new Button({
                title: 'Klik Disini Untuk Pembelian',
                url: 'https://alqolam.com',
            }),
        }));
  }
  else if (option === MUSHAF_MAQAMAT_KIDS) {
    conv.ask("Alquran talking pen untuk anak Mushaf Maqamat For Kids"); // this Simple Response is necessary
        conv.ask(new BasicCard({
            image: new Image({
                url: IMG_MAQAMAT_KIDS, //url of your image.
                alt: 'Maqamat For Kids',
            }),
            title: 'Mushaf Maqamat For Kids',
            subtitle: 'Alquran talking pen yang dilengkapi dengan fitu fitur wanita',
            text: 'Al quran digital yang memberikan kemudahan pada anak-anak untuk belajar membaca Al Quran sesuai dengan kaidah tahsiah yang benar. Desain yang dibuat khusus agar menarik untuk anak-anak dan menanamkan kecintaan mereka pada Al-Quran',
            buttons: new Button({
                title: 'Klik Disini Untuk Pembelian',
                url: 'https://alqolam.com',
            }),
        }));
  }
  else if (option === AUDIO_HAJI) {
    conv.ask("Audio Haji dan Umrah Mabrur"); // this Simple Response is necessary
        conv.ask(new BasicCard({
            image: new Image({
                url: IMG_HAJI_UMRAH, //url of your image.
                alt: 'Audio Haji Umrah',
            }),
            title: 'Mushaf Maqamat For Kids',
            subtitle: 'Alquran talking pen yang dilengkapi dengan fitu fitur wanita',
            text: 'MABRUR - Audio Haji & Umroh “Solusi Praktis Menghafal Do’a-Do’a Haji dan Umrah, Serta Mendengarkan Murottal Al-Qur’an.” Edisi Terbaru Dilengkapi Murottal Al-Qur’an & Al-Ma’tsurat',
            buttons: new Button({
                title: 'Klik Disini Untuk Pembelian',
                url: 'https://alqolam.com',
            }),
        }));
  }
})

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
                title: 'Klik Disini Untuk Pembelian',
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