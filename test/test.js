'use strict';
/* jshint ignore:start */
var assert = require('assert');
var should = require('should');
var peruse = require('../peruse.js');
var scraper = undefined;

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
        var siteData = [
        {
            'selector': [
                {
                    'text': '.panel-body > .comment-container',
                    'date': '.panel-body > .text-muted.date'
                }
            ],
            'baseUrl': 'https://www.airbnb.com/users/show/'
        },
        {
            'selector': [
                {
                    'text': '.panel-body > .comment-container',
                    'date': '.panel-body > .text-muted.date'
                }
            ],
            'baseUrl': 'https://www.airbnb.com/users/show/'
        }
        ];
        scraper = new peruse(siteData, {'verbose': false, 'identifier': '492445'});
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
                    done();
                }
                else {
                    throw({'message': 'Didn\'t find any data!'});
                }

            });
        })
    });


});


describe('PeruseJS - with dogvacay data', function() {
    before(function() {
        var siteData = [{
            'baseUrl': 'http://dogvacay.com/',
            'selector': [
                {
                    'text': '.profilereviewblurb > p',
                    'date': {
                        'selector': '.profilereviewblurb > meta[itemprop="datePublished"]',
                        'type': 'meta'
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


// var bs = require('./peruse.js');

// // create a test scraper
// var scraper = Object.create(bs);
// scraper.test();

/* jshint ignore:end */
