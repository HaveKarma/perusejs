'use strict';
//
// HaveKarma.com Base Scraper 'class'
// Author: justin@havekarma.com
// Date: 12.30.2013
//
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');

// Create the initial Peruse Object
var Peruse = function() {
    this._selectors = [];
    this._scrapers = [];
    this._collectedData = [];
    return this;
};


// use request and cheerio to get the HTML data
Peruse.prototype.getHTML = function() {

};

// this function does the scraping, saving the data locally.
Peruse.prototype.scrape = function() {

};

// helper function to callback to external code
Peruse.prototype.callback = function() {

};

// createURL - should be overridden in base classes
Peruse.prototype.createURL = function() {
    return '';
};

module.exports = Peruse;

/*

// all arguments are optional, yet probably important
module.exports =  {
    // selector is the default selector(s) we use to scrape.
    // will try each one in order.
    _selectors: [],
    _scrapers: [],
    _collectedData: [],

    // use request and cheerio to get the HTML data
    getHTML: function(identifier){
        var self = this;
        var url = this.createURL(identifier);
        console.log('getHTML ' +  url);
        request(url, function(err, resp, html)
        {
            if (err)
            {
                console.error('ERROR Parsing Page: ' + err);
            }
            else
            {
                var $ = cheerio.load(html);
                self.scrape($, self._selectors[0], self.callback);
            }
        });
    },

    // this function does the scraping, saving the data locally.
    scrape: function($, selector, cb){
        console.log('scraping');
        var self = this;
        _.each($(selector), function(m, iterator, list){
            self._collectedData.push($(m).html());
            if (iterator === list.length-1)
            {
                cb();
            }
        });
    },

    // helper function to callback to external code
    callback: function(){
        console.log('Found ' + this._collectedData.length + ' data block.');
    },

    // createURL - should be overridden in base classes
    createURL: function(identifier){
        console.log('creating URL with ' + identifier);
        return 'http://www.google.com' + (identifier !== null ? identifier : '');
    },

    // easy way to test it before we get unit testing in
    test: function() {
        _.bindAll(this, 'callback');
        console.log('testing 1 2 3');
        this._selectors.push('title');
        this.getHTML(null);
    }
};

*/
