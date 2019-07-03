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

const functions = require('firebase-functions')
const Datastore = require('@google-cloud/datastore');
const {
  dialogflow
} = require('actions-on-google')
const {
  SimpleResponse,
  BasicCard,
  Image,
  Suggestions,
  Button
} = require('actions-on-google');
const datastore = Datastore();

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

const SUGGEST = new Array("Murottal Al-Quran",
                          "Murottal dan Terjemahan",
                          "Do’a-do’a",
                          "Ayat-Ayat Tematik",
                          "Informasi Produk"
                    );

const BOOK_NAME = new Array("Surah Alfatihah",
                            "Surah Yasin",
                        // "alwaqiah" => "Surah Al Waqiah",
                        // "almulk" => "Surah Al-Mulk",
                        // "arrahman" => "Surah Ar-Rahman",
                        // "alikhlas" => "Surah Al-Ikhlas",
                        // "alfalaq" => "Surah Al-Falaq",
                        // "annas" => "Surah An-Nās",
                );
app.intent('start_app', (conv) => {
    const initMessage = "Assalamualaikum! Selamat datang di Al-Qolam! \n Kami siap menemani Anda untuk belajar, membaca dan mendengarkan Al-Qur’an. Apa yang ingin Anda baca dan dengarkan? ";
    return getMessageFromQuote(initMessage,conv,SUGGEST);
});

app.intent('intent_murottal', (conv) => {
   const initMessage = `Baik. Surah apa yang ingin Anda baca dan dengarkan? `;
    return getMessageFromQuote(initMessage,conv,BOOK_NAME);
});

app.intent('one_more_yes', (conv) => {
    const initMessage = `Baik, ini kata kata mutiara yang lain`;
    return getMessageFromQuote(initMessage,conv);
});

app.intent('one_more_no', (conv) => {
    conv.close("Semoga anda menjadi terinspirasi dengan kata kata mutiara dari kami, Semoga hari anda menyenangkan dan silahkan kembali lagi.");
});

app.intent('quit_app', (conv) => {
    conv.close("Semoga hari Anda menyenangkan, Sampai Ketemu Lagi");
});

app.intent('Default Fallback Intent', (conv) => {
    console.log(conv.data.fallbackCount);
    if (typeof conv.data.fallbackCount !== 'number') {
      conv.data.fallbackCount = 0;
    }
    conv.data.fallbackCount++;
    // Provide two prompts before ending game
    if (conv.data.fallbackCount === 1) {
      return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Would you like to hear a quote?"));
    }else if(conv.data.fallbackCount === 2){
      return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Selamat datang di Him Speaking, Berbagi Kata kata mutiara dengan Him Speak, Selamat mendengarkan"));
    }
   return conv.close("Saya tidak mengerti, Semoga hari Anda Menyenangkan");
});

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



// HTTP Cloud Function for Firebase handler
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);