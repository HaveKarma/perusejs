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
    this._collectedData = [];
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
                self.done({message: 'ERROR Parsing Page: ' + err, options: self.options, url: url}, [], self.options);
            }
            else if (resp.statusCode !== 200) {
                self.done({message: 'ERROR Status Code: ' + resp.statusCode, options: self.options}, [], self.options);
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

        this.done(null, this._collectedData, this.options);
    }
};

Peruse.prototype._getData = function(result, options, $) {
    var data = '';
    switch(options.type) {
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
        case 'attr':
            data = $(result).attr(options.attr);
            break;
        default:
            console.log('Unsupported data type: ' + options.type + '!');
            break;
    }

    if (this.options.verbose) {
        console.log('Peruse::scrape() _getData() Data: ' + data + ' Type: ' + options.type);
    }

    return data;
};

// this function does the scraping, saving the data locally.
Peruse.prototype.scrape = function($, selectors, cb) {
    var self = this;
    var options = {};


    if (this.options.verbose) {
        console.log('Peruse::scrape() scraping '.red + selectors.length + ' selectors.' + JSON.stringify(selectors));
    }
    _.each(selectors, function(sel) {
        var i = self._collectedData.length;
        _.each(sel, function(value, key){
            var j = i;
            var even = false;
            var evenTracker = 0;
            options.type = 'html';

            if (typeof value === 'object') {
                options.type = value.type;
                options.attr = value.attr;
                value = value.selector;
            }
            if (value.indexOf(':even') > -1) {
                even = true;
                value = value.replace(':even','');
            }

            if (self.options.verbose) {
                console.log('Peruse::scrape() Scraping Selector: '.cyan + value + ' length: ' + $(value).length);
            }

            _.each($(value), function(result){
                if (((even) && (evenTracker % 2 === 0)) || !even) {
                    if (self._collectedData[j] === undefined) {
                        var newData = {};
                        newData[key] = self._getData(result, options, $);
                        self._collectedData.push(newData);
                    }
                    else {
                        // we've already scraped a selector for this job...
                        self._collectedData[j][key] =  self._getData(result, options, $);
                    }
                    j++;
                }
                evenTracker++;

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
