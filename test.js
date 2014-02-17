'use strict';
var peruse = require('./peruse');

console.log('Setting up Scraper...');
var siteData = {
        'selector': [
            {
                'text': '.speech-bubble p.message',
                'date': '.speech-bubble p.date'
            }
        ],
        'baseUrl': 'https://www.airbnb.com/users/show/',
        'identifier': '492445' //5053108  //492445
    };
var scraper = new peruse(siteData);

console.log('calling process()');
scraper.process(function(data) {
    console.log('DONE ' + data.length);
    console.log(JSON.stringify(data));
});
