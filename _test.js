'use strict';
var request = require('request');

var options = {
    url: 'http://dogvacay.com/Happy-Home-Away-from-Home-Dog-Boarding-39803',
    headers: {
        'User-Agent': 'request'
    }
};

function callback(error, response, body) {
    console.log('REQUEST: ' + response.statusCode);
}

console.log('Sending Request');
request(options, callback);


////////////////////

// console.log('trying with peruse wrapper');
// var peruse = require('./peruse');
//
// var siteData = {
//     'baseUrl': 'http://dogvacay.com/',
//     'selector': [
//         {
//             'text': '.profilereviewblurb > p',
//             'date': {
//                 'selector': '.profilereviewblurb > meta[itemprop="datePublished"]',
//                 'type': 'meta'
//             }
//         }
//     ]
// };
//
// var scraper = new peruse(siteData);
// scraper.process(function(data) {
//     console.log('PERUSE: ' + JSON.stringify(data));
// });
