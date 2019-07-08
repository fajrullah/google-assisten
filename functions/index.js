// 'use strict';

// const functions = require('firebase-functions');
// const {WebhookClient} = require('dialogflow-fulfillment');
// const {Card, Suggestion} = require('dialogflow-fulfillment');

// process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


// exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
//     const agent = new WebhookClient({ request, response });
//     const app = dialogflow() // Create an app instance
//     console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
//     console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

//     // function welcome (agent) {
//     //     agent.add(`Welcome to my agent!`);
//     // }

//     app.intent('Default Welcome Intent', (conv) => {
//         conv.ask('Hi, how is it going?')
//     });

//   function fallback (agent) {
//     agent.add(`I didn't understand`);
//     agent.add(`I'm sorry, can you try again?`);
//   }

//   // // Uncomment and edit to make your own intent handler
//   // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
//   // // below to get this function to be run when a Dialogflow intent is matched
//   // function yourFunctionHandler(agent) {
//   //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase inline editor!`);
//   //   agent.add(new Card({
//   //       title: `Title: this is a card title`,
//   //       imageUrl: 'https://dialogflow.com/images/api_home_laptop.svg',
//   //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
//   //       buttonText: 'This is a button',
//   //       buttonUrl: 'https://docs.dialogflow.com/'
//   //     })
//   //   );
//   //   agent.add(new Suggestion(`Quick Reply`));
//   //   agent.add(new Suggestion(`Suggestion`));
//   //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
//   // }

//   // // Uncomment and edit to make your own Google Assistant intent handler
//   // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
//   // // below to get this function to be run when a Dialogflow intent is matched
//   // function googleAssistantHandler(agent) {
//   //   let conv = agent.conv(); // Get Actions on Google library conv instance
//   //   conv.ask('Hello from the Actions on Google client library!'); // Use Actions on Google library
//   //   agent.add(conv); // Add Actions on Google library responses to your agent's response
//   // }

//   // Run the proper function handler based on the matched Dialogflow intent name
//   let intentMap = new Map();
//   intentMap.set('Default Welcome Intent', welcome);
//   intentMap.set('Default Fallback Intent', fallback);
//   // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
//   // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
//   agent.handleRequest(intentMap);
// });


'use strict';

const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
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
  Table,
} = require('actions-on-google');
// const intentSuggestions = [
//   'smart hafiz',
//   'hafiz doll',
// ];
// const datastore = Datastore();

const admin = require('firebase-admin');
var config = {
  apiKey: "AIzaSyC6odRTqCJkySu5i5FDJZFJANtbU7MgJ7U",
  authDomain: "himspeak-a0f56.firebaseapp.com",
  databaseURL: "https://himspeak-a0f56.firebaseio.com",
  projectId: "himspeak-a0f56",
  storageBucket: "",
  messagingSenderId: "1029740290293",
  appId: "1:1029740290293:web:48e370ba0f90155a"
};

const select_smart_hafiz = 'smarthafiz';
const select_hafiz_doll = 'hafizdoll';


// Constants for selected item responses
const PRODUCTS_RESPONSES = {
   [select_smart_hafiz] : 'Anda memilih Smart Hafiz',
   [select_hafiz_doll] : 'Anda memilih Hafiz Doll',
};


// Create an app instance
const app = dialogflow()

// Register handlers for Dialogflow intents
// app.intent('Default Welcome Intent', conv => {
//   conv.ask('Hi, how is it going?')
//   conv.ask(`Here's a picture of a cat`)
// })

// // Intent in Dialogflow called `Goodbye`
// app.intent('Goodbye', conv => {
//   conv.close('See you later!')
// })

// app.intent('Default Fallback Intent', conv => {
//   conv.ask(`I didn't understand. Can you tell me something else?`)
// })


const Contexts = {
    ONE_MORE: 'one_more'
};

// const SUGGEST = new Array("Murottal Al-Quran",
//                           "Murottal dan Terjemahan",
//                           "Do’a-do’a",
//                           "Ayat-Ayat Tematik",
//                           "Informasi Produk"
//                    );

const BOOK_NAME = new Array("Surah Alfatihah",
                            "Surah Yasin",
                            "Surah An-Nas",
                        // "alwaqiah" => "Surah Al Waqiah",
                        // "almulk" => "Surah Al-Mulk",
                        // "arrahman" => "Surah Ar-Rahman",
                        // "alikhlas" => "Surah Al-Ikhlas",
                        // "alfalaq" => "Surah Al-Falaq",
                        // "annas" => "Surah An-Nās",
                );

// const product_suggestion = new Array ("Smart Hafiz",
//                                       "Hafiz Doll Billingual",
//                                       "Super Hafiz");


// const initMessage = "Ini Isi deksripsi dari Smart Hafiz";

admin.initializeApp(config);
var database = admin.database();


app.intent('start_app', (conv) => {
    const initMessage = "Assalamualaikum! Selamat datang dan selamat mendengarkan Al Quran dan Do'a Do'a \n surah atau do'a apa yang ingin anda dengarkan.?";
    return getMessageFromQuote(initMessage,conv,BOOK_NAME);
});

app.intent('intent_murottal', (conv) => {
   const initMessage = `Baik. Surah apa yang ingin Anda baca dan dengarkan? `;
    return getMessageFromQuote(initMessage,conv,BOOK_NAME);
});

// app.intent('one_more_yes', (conv) => {
//     const initMessage = `Baik, ini kata kata mutiara yang lain`;
//     return getMessageFromQuote(initMessage,conv);
// });

// app.intent('one_more_no', (conv) => {
//     conv.close("Semoga anda menjadi terinspirasi dengan kata kata mutiara dari kami, Semoga hari anda menyenangkan dan silahkan kembali lagi.");
// });

// app.intent('quit_with_product', (conv) => {
//   conv.close("Kami menyediakan produk edukasi untuk anak, apakah anda ingin melihat katalog kami");
// });

// app.intent('quit_app', (conv) => {
//     const initMessage= "Kami menyediakan produk edukasi untuk anak yang dapat dilihat dibawah ini";
//     return getMessageFromQuote(initMessage,conv,product_suggestion);
// });

// List
app.intent('quit_app', (conv) => {
  conv.ask('Kami menyediakan produk edukasi untuk anak yang dapat dilihat dibawah ini');
  // conv.ask(new Suggestions(intentSuggestions));
  conv.ask(new List({
    title: 'Produk Edukasi Anak Dari Alqolam',
    items: {
      // Add the first item to the list
      select_smart_hafiz : {
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
      select_hafiz_doll : {
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


// Handle list or carousel selection
app.intent('item selected', (conv, params, option) => {
  let response = 'Silahkan Pilih Produk';
  if (option && PRODUCTS_RESPONSES.hasOwnProperty(option)) {
    response = PRODUCTS_RESPONSES[option];
  } else {
    response = 'Terimakasih, silahkan kembali lagi apabila Anda tertarik dengan produk kami';
  }
  conv.ask(response);
  conv.ask(new Suggestions(intentSuggestions));
});



app.intent('detail_product', (conv) => {
    const product_type = conv.parameters['product_type'].toLowerCase();
    if (product_type === "smart hafiz") {
               conv.ask("ini produk smart hafiz"); // this Simple Response is necessary
               conv.ask(new BasicCard({
                    image: new Image({
                     url: 'https://assets.alqolam.com/images/2019/04/08/5.jpg', //url of your image.
                     alt: 'Smart Hafiz',
                 }),
                 title : 'Smart Hafiz',
                 subtitle : 'Bermain & belajar bersama Smart Hafiz',
                 text : 'Produk Edukasi Visual untuk anak meningkatkan kecerdasan motorik dan dapat belajar bersama smart hafiz',
                 buttons: new Button({
                  title: 'Selengkapnya',
                  url: 'https://alqolam.com',
                }),
                }));
                conv.ask(new SimpleResponse({
                  speech: 'Silahkan masukan email dan nomor telepon apabila anda tertarik dengan produk ini',
                  text: 'Silahkan masukan email dan nomor telepon apabila anda tertarik dengan produk ini',
                }));

    }else if (product_type === "hafiz doll") {
        conv.ask("Ini Hafiz Doll");
        conv.ask(new BasicCard({
          image: new Image({
           url: 'https://assets.alqolam.com/images/2019/04/08/4.jpg', //url of your image.
           alt: 'Smart Hafiz',
       }),
}));
    }else {
        conv.ask("Silahkan Pilih Produk")
}
});

app.intent('Default Fallback Intent', (conv) => {
    console.log(conv.data.fallbackCount);
    if (typeof conv.data.fallbackCount !== 'number') {
      conv.data.fallbackCount = 0;
    }
    conv.data.fallbackCount++;
    // Provide two prompts before ending game
    if (conv.data.fallbackCount === 1) {
      return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Apakah Anda ingin mendengarkan Al-Quran.?? Surat Aapa yang ingin anda dengar?"));
    }else if(conv.data.fallbackCount === 2){
      return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Selamat datang di Him Speaking, Berbagi Kata kata mutiara dengan Him Speak, Selamat mendengarkan"));
    }
   return conv.close("Saya tidak mengerti, Semoga hari Anda Menyenangkan");
});

// function takeUserDetails(agent) {
//   return database.ref('users')
//      .push({
//           phoneNumber: agent.parameters.phoneNumber,
//           email: agent.parameters.email
//         })
//     .then(()=> {
//     agent.add(`Terimakasih, sales agent kami akan menghubungi anda`);
//   });
// }



function getEndingMessage(){
return `  <audio src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" clipBegin="10s" clipEnd="13s">Consider the quote!</audio>`;
}
function getEndingMessageText(){
  return `Apakah anda ingin mendengarkan kata kata mutiara yang lain?`;
  }
function getMessageFromQuote(initMessage,conv, sugest){
    return conv.ask(new Suggestions(sugest), new SimpleResponse(initMessage),
    new SimpleResponse( {text: getEndingMessageText(),
    speech: `<speak> ` + getEndingMessage() + ` </speak>  ` }));
 }

// function getQuote(){
//   return new Promise(((resolve,reject) => {
//     let randomQuoteNum = getRandomNumber();
//     console.log("the id of the quote is: quote_"+randomQuoteNum);
//     const key = datastore.key(['quote', 'quote_'+randomQuoteNum]);
//     console.log("Querying datastore for the quote..."+key);
//     let readableQuote = '';
//     datastore.get(key,(err,entity) => {
//         if(!err){
//             console.log('entity:'+entity.quote);
//             resolve(entity);
//         }else{
//             reject(console.log('Error occured'));
//         }
//   });
//   }));
// }

// let intentMap = new Map();
//   intentMap.set('take_user_details', takeUserDetails);

//   agent.handleRequest(intentMap);

// HTTP Cloud Function for Firebase handler
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);