'use strict';
var request = require('request');

var options = {
    url: 'http://dogvacay.com/Happy-Home-Away-from-Home-Dog-Boarding-39803',
    headers: {
        'User-Agent': 'request'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log(body);
    }
}

console.log('Sending Request');
request(options, callback);
