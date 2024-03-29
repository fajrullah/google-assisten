'use strict';
//Initialize libraries
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
const {
  SimpleResponse,
  BasicCard,
  Image,
  Suggestions,
  Button
} = require('actions-on-google');
// Instantiate a datastore client
const datastore = Datastore();


  const app = dialogflow({debug: true});
app.middleware((conv) => {

  });
//Setup contexts
const Contexts = {
    ONE_MORE: 'one_more'
  };
app.intent('quit_app', (conv) => {
    conv.close("Semoga hari Anda menyenangkan, Sampai Ketemu Lagi");
  });
app.intent('start_app', (conv) => {
    conv.contexts.set(Contexts.ONE_MORE,5);
    const initMessage = "Selamat datang di Him Speaking, Berbagi Kata kata mutiara dengan Him Speak, Selamat mendengarkan";
return  getQuote().then((entity)=>{
         return getMessageFromQuote(entity,initMessage,conv);
    });

  });
app.intent('one_more_yes', (conv) => {
    conv.contexts.set(Contexts.ONE_MORE,3);
      const initMessage = `Baik, ini kata kata mutiara yang lain`;

    return  getQuote().then((entity)=>{
      return getMessageFromQuote(entity,initMessage,conv);
  });

  });
app.intent('one_more_no', (conv) => {
    conv.close("Semoga anda menjadi terinspirasi dengan kata kata mutiara dari kami, Semoga hari anda menyenangkan dan silahkan kembali lagi.");
});
app.intent('Default Fallback Intent', (conv) => {
    console.log(conv.data.fallbackCount);
    if (typeof conv.data.fallbackCount !== 'number') {
      conv.data.fallbackCount = 0;
    }
    conv.data.fallbackCount++;
    // Provide two prompts before ending game
    if (conv.data.fallbackCount === 1) {
      conv.contexts.set(Contexts.ONE_MORE,2);
      return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Would you like to hear a quote?"));
    }else if(conv.data.fallbackCount === 2){
      return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse("Selamat datang di Him Speaking, Berbagi Kata kata mutiara dengan Him Speak, Selamat mendengarkan"));
    }
   return conv.close("Saya tidak mengerti, Semoga hari Anda Menyenangkan");
});
function getRandomNumber(){
return  Math.floor((Math.random()*num_quotes)+1);
}
function buildReadableQuoteFromEntity(entity){
  let readableQuote =  entity.quote +
     `<break time="1s"/> This was said by ` + entity.author + ` `  ;
     if(entity.comments){
       readableQuote +=  entity.comments + ` `;
     }
     return readableQuote;
}
function getViewableQuote(entity){
  let viewableQuote =  entity.quote +
     `.This was said by ` + entity.author + ` `  ;
     if(entity.comments){
      viewableQuote +=  entity.comments + ` `;
     }
     return viewableQuote;
}
function getEndingMessage(){
return `  <audio src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" clipBegin="10s" clipEnd="13s">Consider the quote!</audio>
     Apakah anda ingin mendengarkan kata kata mutiara yang lain?`;
}
function getEndingMessageText(){
  return `.Apakah anda ingin mendengarkan kata kata mutiara yang lain?`;
  }
function getMessageFromQuote(entity,initMessage,conv){
  return conv.ask(new Suggestions('Ya', 'Tidak'), new SimpleResponse(initMessage),
  new SimpleResponse( {text: getViewableQuote(entity) + getEndingMessageText(),
speech: `<speak> ` +  buildReadableQuoteFromEntity(entity)   + getEndingMessage() + ` </speak>  ` }));
 }
function getQuote(){
  return new Promise(((resolve,reject) => {
    let randomQuoteNum = getRandomNumber();
  console.log("the id of the quote is: quote_"+randomQuoteNum);
  const key = datastore.key(['quote', 'quote_'+randomQuoteNum]);
  console.log("Querying datastore for the quote..."+key);
  let readableQuote = '';
  datastore.get(key,(err,entity) => {
    if(!err){
      console.log('entity:'+entity.quote);
    resolve(entity);
    }else{
     reject(console.log('Error occured'));
    }
  });
  }));
}
// HTTP Cloud Function for Firebase handler
exports.KataMutiara = functions.https.onRequest(app);