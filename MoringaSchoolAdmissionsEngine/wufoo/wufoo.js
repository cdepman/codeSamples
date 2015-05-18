var https = require('https');
var config = require('../config').wufoo;

var headers = {
  'Authorization': 'Basic ' + new Buffer(config.wufoo_key + ':' + config.wufoo_password).toString('base64')
};

var options = {
  host: 'moringas.wufoo.com',
  path: '/api/v3/forms/moringa-school-application/entries.json?pageSize=25&sort=DateCreated&sortDirection=DESC',
  method: 'GET',
  headers: headers
};

exports.getEntries = function(callback) {
  var request = https.request(options, function(response) {
    response.setEncoding('utf-8');
    var buffer = '';

    response.on('data', function(data) {
      buffer += data;
    });

    response.on('end', function() {
      var result = JSON.parse(buffer);
      callback(result);
    });
  });
  request.end();
};