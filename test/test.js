'use strict';
/* jshint ignore:start */
var assert = require('assert');
var should = require('should');
var peruse = require('../peruse.js');
var scraper = undefined;

describe('PeruseJS', function() {
    before(function() {
        scraper = new peruse();
    });

    describe('Creating a Peruse Object', function() {
        it('should be ok', function(){
            should(scraper).be.ok;
            should(scraper).have.property('createURL');
            should(scraper).have.property('getHTML');
            should(scraper).have.property('scrape');
            should(scraper).have.property('callback');
            // assert.equal(-1, [1,2,3].indexOf(5));
            // assert.equal(-1, [1,2,3].indexOf(0));
        });

        it ('should return string', function() {
            describe('Do something', function() {
                scraper.createURL().should.be.type('string');
            });
        });
    });

    
});

// var bs = require('./peruse.js');

// // create a test scraper
// var scraper = Object.create(bs);
// scraper.test();

/* jshint ignore:end */