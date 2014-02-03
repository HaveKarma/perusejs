'use strict';
var peruse = require('./peruse');

console.log('Setting up Scraper...');
var scraper = new peruse(
        {
            'selector': 'p.message',
            'baseUrl': 'https://www.airbnb.com/users/show/',
            'identifier': '492445'
        }
    );

console.log('calling process()');
scraper.process(function() {
    console.log('DONE');
});
