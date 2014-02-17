'use strict';
var peruse = require('./peruse');

console.log('Setting up Scraper...');
var siteData = {
        'selector': [
            {
                'text': '.profilereviewblurb > p',
                'date': {
                    'selector': '.profilereviewblurb > meta[itemprop="datePublished"]',
                    'type': 'meta'
                }
            }
        ],
        'baseUrl': 'http://dogvacay.com/',
        'identifier': 'Happy-Home-Away-from-Home-Dog-Boarding-39803' //5053108  //492445
    };
var scraper = new peruse(siteData);

console.log('calling process()');
scraper.process(function(data) {
    console.log('DONE ' + data.length);
    console.log(JSON.stringify(data));
});


var siteData = {
        'selector': [
            {
                'text': '.speech-bubble p.message',
                'date': '.speech-bubble p.date'
            }
        ],
        'baseUrl': 'https://www.airbnb.com/users/show/',
        'identifier': '5053108' //5053108  //492445
    };
var scraper = new peruse(siteData);

console.log('calling process()');
scraper.process(function(data) {
    console.log('DONE ' + data.length);
    console.log(JSON.stringify(data));
});
