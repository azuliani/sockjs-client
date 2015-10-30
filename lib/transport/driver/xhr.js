'use strict';

var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  , http = require('http')
  , https = require('https')
  , URL = require('url-parse')
  , fetchHelper = require("./fetchHelper");
;


var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:driver:xhr');
}

function XhrDriver(method, url, payload, opts) {
  debug(method, url, payload);
  var self = this;
  EventEmitter.call(this);

  var socksOpts = opts && opts['socks-options'];
  var headers = opts && opts.headers;

/*
  var protocol = parsedUrl.protocol === 'https:' ? https : http;
  this.req = protocol.request(options, function(res) {
    console.log(res);
    res.setEncoding('utf8');
    var responseText = '';

    res.on('data', function(chunk) {
      debug('data', chunk);
      responseText += chunk;
      self.emit('chunk', 200, responseText);
    });
    res.once('end', function() {
      debug('end');
      self.emit('finish', res.statusCode, responseText);
      self.req = null;
    });
  });
  */

  fetchHelper(url, headers, socksOpts, function(err, res){
    if (err)
      return self.emit('finish',405, err);
    self.emit('finish', 200, res);
  })
}

inherits(XhrDriver, EventEmitter);

XhrDriver.prototype.close = function() {
  debug('close');
  this.removeAllListeners();
  if (this.req) {
    this.req.abort();
    this.req = null;
  }
};

XhrDriver.enabled = true;
XhrDriver.supportsCORS = true;

module.exports = XhrDriver;
