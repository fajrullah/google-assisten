// function getEndingMessageText() {
//     return `Apakah anda ingin mendengarkan kata kata mutiara yang lain?`;
// }

// function getEndingMessage() {
//     return `  <audio src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" clipBegin="10s" clipEnd="13s">Consider the quote!</audio>`;
// }

// exports.getMessage = getMessage;


module.exports = {
    getEndingMessageText: function(){
        return `Apakah anda ingin mendengarkan kata kata mutiara yang lain?`;
    },
    getEndingMessage: function(){
        return `  <audio src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" clipBegin="10s" clipEnd="13s"></audio>`;
    },

}