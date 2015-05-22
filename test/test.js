'use strict';
/* jshint ignore:start */
var assert = require('assert');
var should = require('should');
var peruse = require('../peruse.js');
var scraper = undefined;
require('colors');

describe('PeruseJS - sans arguments', function() {
    before(function() {
        scraper = new peruse();
    });

    describe('Creating a Peruse Object', function() {
        it('should be ok', function(){
            should(scraper).be.ok;
            should(scraper).have.property('_createURL');
            should(scraper).have.property('process');
            should(scraper).have.property('scrape');
        });

        it ('_createURL()', function() {
            describe('- should return string', function() {
                scraper._createURL().should.be.type('string');
            });
        });

        it('#process()', function(){
            it('should run without error', function(done){
                scraper.process(function() {
                    done();
                });
            });
        })

    });
});

describe('PeruseJS - with airbnb data', function() {
    before(function() {
        var siteData = {
            "baseUrl": "https://www.airbnb.com/users/show/",
            "selector": [{
                "text": ".as_host .comment-container p",
                "date": ".as_host .date.hide-sm"
            },
        {
            "text": ".as_guest .comment-container p",
            "date": ".as_guest .date.hide-sm"
        }]
        };
        scraper = new peruse(siteData, {'verbose': true, 'identifier': '2955848'}); //492445
    });

    describe('Creating a Peruse Object', function() {
        it('should be ok', function(){
            should(scraper).be.ok;
        });

        it ('_createURL() - should return string', function() {
            describe('Do something', function() {
                scraper._createURL().should.be.type('string');
            });
        });

        describe('#process()', function(){
            this.timeout(5000);
            var data = null;
            it('should run without error in < 5000ms', function(done){
                scraper.process(function(err, _data) {
                    done();
                    data = _data;
                });
            });

            it('should return results', function(done){
                if (data.length > 0) {
                    console.log(JSON.stringify(data, null, 4));
                    done();
                }
                else {
                    throw({'message': 'Didn\'t find any data!' + JSON.stringify(data,null,4)});
                }

            });

        })
    });


});

/*
describe('PeruseJS - with dogvacay data', function() {
    before(function() {
        var siteData = [{
            'baseUrl': 'http://dogvacay.com/',
            'selector': [
                {
                    'text': '.review-cont > .oh > p',
                        "date": {
                        "selector": ".review-cont > .oh > meta[itemprop='datePublished']",
                        "type": "meta"
                    }
                }
        ]
        }];
        scraper = new peruse(siteData, {'verbose': false, 'htmlDump': false, 'identifier': 'Happy-Home-Away-from-Home-Dog-Boarding-39803'});
    });

    describe('Creating a Peruse Object', function() {
        it('should be ok', function(){
            should(scraper).be.ok;
        });

        it ('_createURL() - should return string', function() {
            describe('Do something', function() {
                scraper._createURL().should.be.type('string');
            });
        });

        describe('#process()', function(){
            this.timeout(5000);
            var data = null;
            it('should run without error in < 5000ms', function(done){
                scraper.process(function(err, _data) {
                    data = _data;
                    done();
                });
            });

            it('should return results', function(done){
                if (data.length > 0) {
                    done();
                }
                else {
                    throw({'message': 'Didn\'t find any data!'});
                }

            });
        })
    });
});



describe('PeruseJS - with Relay Rides data', function() {
    before(function() {
        var siteData = [{
            'baseUrl': 'https://www.relayrides.com/drivers/',
            'selector': [
                {
                    'text': '.review-list-item .content div:even',
                    'date': '.review-list-item .content .attribution span'
                }
        ]
        }];
        scraper = new peruse(siteData, {'verbose': false, 'htmlDump': false, 'identifier': '18487'});
    });

    describe('Creating a Peruse Object', function() {
        it('should be ok', function(){
            should(scraper).be.ok;
        });

        it ('_createURL() - should return string', function() {
            describe('Do something', function() {
                scraper._createURL().should.be.type('string');
            });
        });

        describe('#process()', function(){
            this.timeout(5000);
            var data = null;
            it('should run without error in < 5000ms', function(done){
                scraper.process(function(err, _data) {
                    data = _data;
                    done();
                });
            });

            it('should return results', function(done){
                if (data.length > 0) {
                    done();
                }
                else {
                    throw({'message': 'Didn\'t find any data!'});
                }

            });
        })
    });
});
*/

// var bs = require('./peruse.js');

// // create a test scraper
// var scraper = Object.create(bs);
// scraper.test();

/* jshint ignore:end */
