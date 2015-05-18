var nodemailer = require('nodemailer');
var config = require('../config').mail;
var util = require('util');
var Promise = require('bluebird');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.email,
    pass: config.password
  }
});

var sendFullTimeEmail = exports.sendFullTimeEmail = function(content, name, address, AorB) {
  var options = {
    from: 'Moringa School Admissions <' +config.email+ '>',
    subject: 'Moringa School Application: Next Steps',
    text: util.format(content.text, name),
    html: util.format(content.html, name),
    to: address
  };
  return new Promise(function(resolve, reject) {
    transporter.sendMail(options, function(err, info) {
      if (err) {
        reject(err);
        return;
      }
      info.type = AorB;
      resolve(info);
      return;
    });
  });
};

var sendPartTimeEmail = exports.sendPartTimeEmail = function(content, name, address) {
  var options = {
    from: 'Moringa School Admissions <' +config.email+ '>',
    subject: 'Moringa School Part-Time Application: Next Steps',
    text: util.format(content.text, name),
    html: util.format(content.html, name),
    to: address
  };
  return new Promise(function(resolve, reject) {
    transporter.sendMail(options, function(err, info) {
      if (err) {
        reject(err);
        return;
      }
      info.type = AorB;
      resolve(info);
      return;
    });
  });
};