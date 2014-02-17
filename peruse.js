'use strict';
//
// HaveKarma.com Base Scraper 'class'
// Author: justin@havekarma.com
// Date: 12.30.2013
//
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');
var util = require('util');

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
    // console.log('job :' + JSON.stringify(this.jobs));
    this.done = cb;
    var self = this;
    _.each(this.jobs, function(job){
        if (!self._verifyJob(job)) {
            console.error('job not formatted properly');
            return;
        }
        var url = self._createURL(job.baseUrl, job.identifier, job.postfix);
        if (url.trim() === '') {
            console.log('exited early');
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
                if (job.scrape !== undefined) {
                    self.scrape = job.scrape;
                }
                self.scrape($, job.selector, self.jobComplete);
            }
        });
    });
};

Peruse.prototype.jobComplete = function() {
    this.jobCount--;
    if (this.jobCount <= 0) {
        this.done(this._collectedData);
    }
};

Peruse.prototype._getData = function(result, type, $) {
    switch(type) {
        case 'html':
            return $(result).text().trim();
        case 'meta':
            return $(result).attr('content');
    }
};

// this function does the scraping, saving the data locally.
Peruse.prototype.scrape = function($, selectors, cb) {
    var self = this;
    var type = 'html';
    var i = 0;
    console.log('looking for ' + JSON.stringify(selectors));
    // var scrapedData = {};
    _.each(selectors, function(sel, iterator) {
        // scrapedData = {};
        console.log('SCRAPER ---> ' + iterator);
        _.each(sel, function(value, key, list){
            console.log('value: ' + value + ' key: ' + key);
            if (typeof value === 'object') {
                console.log('setting type');
                type = value.type;
                value = value.selector;
            }
            i = 0;
            console.log('TYPE---> ' + type);
            console.log('SELECTOR---> ' + value);
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
                // self._collectedData.push(scrapedData);
                // scrapedData[key] = $(result).html().trim();
            });
            
        });
        
    });
    cb(self._collectedData);
    
};

// createURL - should be overridden in child classes
Peruse.prototype._createURL = function(base, identifier, postfix) {
    var url = (base || '') + (identifier || '') + (postfix || '');
    // console.log(url);
    return url;
};

module.exports = Peruse;
