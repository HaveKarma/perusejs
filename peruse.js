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
        var url = self._createURL(job.baseUrl, job.identifier);
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

// this function does the scraping, saving the data locally.
Peruse.prototype.scrape = function($, selector, cb) {
    var self = this;
    _.each($(selector), function(m, iterator, list){
        var data = $(m).html();
        self._collectedData.push(data);
        if (iterator === list.length-1)
        {
            console.log('scraped ' + self._collectedData.length);
            cb();
        }
    });
};

// createURL - should be overridden in child classes
Peruse.prototype._createURL = function(base, identifier) {
    var url = (base || '') + (identifier || '');
    console.log(url);
    return url;
};

module.exports = Peruse;
