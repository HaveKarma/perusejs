'use strict';
var peruse = require('./peruse');

console.log('Setting up Scraper...');
var siteData = {
        // get auctions currently listed.
        'baseUrl': 'http://www.ebay.com/sch/m.html?_nkw=&_armrs=1&_from=&_ssn=',
        'postfix': '&_ipg=200&rt=nc',
        'selector': [
            {
                'title': '.ittl',
                'url': {
                    'selector': '.ittl > h3 > a',
                    'type': 'href'
                },
                'photo': {
                    'selector': '.picW img',
                    'type': 'src'
                }
            }
        ]
    };

var scraper = new peruse(siteData, {verbose: true, 'identifier': 'rockmusicnerd'});

console.log('calling process()');
scraper.process(function(data) {
    console.log('DONE ' + data.length);
    console.log(JSON.stringify(data));
});
