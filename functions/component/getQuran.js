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

const {
    SUGGEST,
    BOOK_NAME,
    intentSuggestions,
    product_suggestion,
} = require('./getSuggestion');

const {
    SURAH,
} = require('./surahdata')

module.exports = {
    getIntentMurottal: (quran, conv) => {
        const surahName = Object.keys(SURAH);
        if (surahName.includes(quran)) {
            if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
                conv.close('Sorry, this device does not support audio playback.');
                return;
            }
            if(surahName.includes(quran)){
                conv.ask(SURAH[quran].desc); // this Simple Response is necessary
                conv.ask(new MediaObject({
                    name: SURAH[quran].name,
                    url: SURAH[quran].url,
                    description: SURAH[quran].desc,
                    icon: new Image({
                        url: 'https://assets.alqolam.com/images/2019/07/08/logo.png',
                        alt: 'Al-Qolam',
                    }),
                }));
                conv.ask(new Suggestions(BOOK_NAME));
            }
        }
        else {
            conv.ask("Silahkan Pilih Surah")
        }
    }
}