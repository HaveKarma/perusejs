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
var Peruse = function(options) {
    options = options || {};
    this._selectors = options.selector || [];
    this._baseUrl = options.baseUrl || '';
    this._identifier = options.identifier || '';
    // this._scrapers = [];
    this._collectedData = [];
    return this;
};


// use request and cheerio to get the HTML data
Peruse.prototype.process = function(cb) {
    var self = this;
    this._callback = cb;
    var url = this._createURL(this.identifier);
    if (url.trim() === '') {
        console.log('exit early');
        return;
    }
    request(url, function(err, resp, html)
    {
        if (err)
        {
            console.error('ERROR Parsing Page: ' + err);
        }
        else
        {
            var $ = cheerio.load(html);
            self.scrape($, self._selectors, self._callback);
        }
    });
};

// this function does the scraping, saving the data locally.
Peruse.prototype.scrape = function($, selector, cb) {
    var self = this;
    _.each($(this._selectors), function(m, iterator, list){
        var data = $(m).html();
        self._collectedData.push(data);
        if (iterator === list.length-1)
        {
            console.log('scraped ' + self._collectedData.length);
            cb();
        }
    });
};

// createURL - should be overridden in base classes
Peruse.prototype._createURL = function() {
    return this._baseUrl + this._identifier;
};

module.exports = Peruse;
