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

    if (this.options.verbose) {
        console.log('\nOPTIONS: ' + JSON.stringify(this.options) + '\n');
    }

    this._collectedData = [];
    return this;
};

Peruse.prototype._verifyJob = function(/*job*/) {
    return true;
};

Peruse.prototype._handleRequest = function(url, callback) {
    request({
        'url': url,
        'timeout': 3000,
        'headers': {
            'User-Agent': 'request'
        }

    }, callback);
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
            console.log('Peruse::process() url: |' + url+'|');
        }
        self._handleRequest(url, function(err, resp, html)
        {
            // @TODO Figure out why this breaks request
            // if (self.options.htmlDump) {
            //     console.log('DOM: ' + html);
            // }
            // if (self.options.verbose) {
            //     console.log('response: ' + JSON.stringify(resp));
            // }

            if (err) {
                console.error({message: 'ERROR Parsing Page: ' + err, options: self.options});
                self.done([], self.options);
            }
            else if (resp.statusCode !== 200) {
                console.error({message: 'ERROR Status Code: ' + resp.statusCode, options: self.options});
                self.done([], self.options);
            }
            else {
                var $ = cheerio.load(html);
                if (job.scrape !== undefined) {
                    self.scrape = job.scrape;
                }
                self.scrape($, job.selector, self.jobComplete, self.options);
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
        case 'href':
            data = $(result).attr('href');
            break;
        case 'src':
            data = $(result).attr('src');
            break;
        default:
            console.log('Unsupported data type: ' + type + '!');
            break;
    }

    if (this.options.verbose) {
        console.log('Peruse::scrape() _getData() Data: ' + data + ' Type: ' + type);
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
    _.each(selectors, function(sel) {
        _.each(sel, function(value, key){
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
    return url.trim();
};

module.exports = Peruse;
