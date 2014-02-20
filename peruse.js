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
var Peruse = function(jobs, options) {
    _.bindAll(this, 'jobComplete');
    // make sure the object passed is in array
    if (jobs !== undefined && jobs.length === undefined) {
        jobs = [jobs];
    }
    this.jobs = jobs || [];
    this.options = options || {};
    this.jobCount = this.jobs.length;

    this._collectedData = [];
    return this;
};

Peruse.prototype._verifyJob = function(job) {
    return true;
};

// use request and cheerio to get the HTML data
Peruse.prototype.process = function(cb) {
    this.done = cb;
    var self = this;
    _.each(this.jobs, function(job){
        if (!self._verifyJob(job)) {
            console.error('job not formatted properly');
            return;
        }
        var url = self._createURL(job.baseUrl, self.options.identifier, job.postfix);
        if (url.trim() === '') {
            console.error('exited early');
            return;
        }
        if (self.options.verbose) {
            console.log('Peruse::process() url:' + url);
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
                if (job.scrape !== undefined) {
                    self.scrape = job.scrape;
                }
                self.scrape($, job.selector, self.jobComplete);
            }
        });
    });
};

Peruse.prototype.jobComplete = function() {
    if (this.options.verbose) {
        console.log('Peruse::jobComplete() ' + this.jobCount + ' ' + this._collectedData.length);
    }
    this.jobCount--;
    if (this.jobCount <= 0) {
       
        this.done(this._collectedData, this.options);
    }
};

Peruse.prototype._getData = function(result, type, $) {
    var data = '';
    switch(type) {
        case 'html':
            data = $(result).text().trim();
            break;
        case 'meta':
            data = $(result).attr('content');
            break;
    }

    if (this.options.verbose) {
        console.log('Peruse::scrape() _getData() ' + data + ' ' + type);
    }

    return data;
};

// this function does the scraping, saving the data locally.
Peruse.prototype.scrape = function($, selectors, cb) {
    var self = this;
    var type = '';
    var i = 0;
    if (this.options.verbose) {
        console.log('Peruse::scrape() scraping ' + selectors.length + ' selectors.');
    }
    _.each(selectors, function(sel, iterator) {
        _.each(sel, function(value, key, list){
            type = 'html';
            if (typeof value === 'object') {
                type = value.type;
                value = value.selector;
            }
            i = 0;
            if (self.options.verbose) {
                console.log('Peruse::scrape() Scraping Selector: ' + value + ' length: ' + $(value).length);
            }
            _.each($(value), function(result){
                if (self._collectedData[i] === undefined) {
                    var newData = {};
                    newData[key] = self._getData(result, type, $);
                    self._collectedData.push(newData);
                }
                else {
                    // we've already scraped a selector for this job...
                    self._collectedData[i][key] =  self._getData(result, type, $);
                }

                i++;
            });
            
        });
        
    });
    cb(self._collectedData, self.options);
    
};

// createURL - should be overridden in child classes
Peruse.prototype._createURL = function(base, identifier, postfix) {
    if (this.options.verbose) {
        console.log('Peruse::_createURL() base: ' + base + ' identifier: ' + identifier + ' postfix: ' + postfix);
    }
    var url = (base || '') + (identifier || '') + (postfix || '');
    return url;
};

module.exports = Peruse;
