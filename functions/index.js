'use strict';

const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
const admin = require('firebase-admin');
const { dialogflow, BasicCard, BrowseCarousel, BrowseCarouselItem, Button, Carousel, Image, LinkOutSuggestion, List, MediaObject, Suggestions, SimpleResponse, Table } = require('actions-on-google');

var config = {
    apiKey: "AIzaSyC6odRTqCJkySu5i5FDJZFJANtbU7MgJ7U",
    authDomain: "himspeak-a0f56.firebaseapp.com",
    databaseURL: "https://himspeak-a0f56.firebaseio.com",
    projectId: "himspeak-a0f56",
    storageBucket: "",
    messagingSenderId: "1029740290293",
    appId: "1:1029740290293:web:48e370ba0f90155a"
};

admin.initializeApp(config);
var database = admin.database();

require("./component/getEndingMessage");
require("./component/getSuggestion");

// Create an app instance
const app = dialogflow()

const select_smart_hafiz = 'smart hafiz';
const select_hafiz_doll = 'hafiz doll';


// Start App
app.intent('start_app', (conv) => {
    const initMessage = "Assalamualaikum! Selamat datang di Al-Qolam! \n Kami siap menemani Anda untuk belajar, membaca dan mendengarkan Al-Qur’an. Apa yang ingin Anda baca dan dengarkan? ";
    return getMessageFromQuote(initMessage, conv, SUGGEST);
});

// Murottal
app.intent('intent_murottal', (conv) => {
    const initMessage = `Baik. Surah apa yang ingin Anda baca dan dengarkan? `;
    return getMessageFromQuote(initMessage, conv, BOOK_NAME);
});

// Do'a - Do'a



// Start List Product
app.intent('quit_app', (conv) => {
    conv.ask('Kami menyediakan produk edukasi untuk anak yang dapat dilihat dibawah ini');
    // conv.ask(new Suggestions(intentSuggestions));
    conv.ask(new List({
        title: 'Produk Edukasi Anak Dari Alqolam',
        items: {
            // Add the first item to the list
            select_smart_hafiz: {
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
            select_hafiz_doll: {
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


// function getEndingMessage() {
//     return `  <audio src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" clipBegin="10s" clipEnd="13s">Consider the quote!</audio>`;
// }

// function getEndingMessageText() {
//     return `Apakah anda ingin mendengarkan kata kata mutiara yang lain?`;
// }

function getMessageFromQuote(initMessage, conv, sugest) {
    return conv.ask(new Suggestions(sugest), new SimpleResponse(initMessage),
        new SimpleResponse({
            text: getEndingMessageText(),
            speech: `<speak> ` + getEndingMessage() + ` </speak>  `
        }));
}

// HTTP Cloud Function for Firebase handler
exports.testLocal = functions.https.onRequest(app);