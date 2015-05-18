var Firebase = require('firebase'); 
var fireBaseConfig = require('../config.js').firebase;

// set database
var emailStore = exports.db = new Firebase(fireBaseConfig.dbAddress);

// authorize with custom token
emailStore.authWithCustomToken(fireBaseConfig.AUTH_TOKEN, function(error, result) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully!");
  }
});

// create db sync result callback
var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
  } else {
    console.log('Synchronization succeeded');
  }
};

// db setters for each email
var setFullTimeEmailA = exports.setFullTimeEmailA = function(text, html, markdown){
  emailStore.child('/fullTime/emailA').update({ 
        text: text,
        html: html,
        markdown: markdown
      }, onComplete);
}

var setFullTimeEmailB = exports.setFullTimeEmailB = function(text, html, markdown){
  emailStore.child('/fullTime/emailB').update({ 
        text: text,
        html: html,
        markdown: markdown
      }, onComplete);
}

var setPartTimeEmailA = exports.setPartTimeEmailA = function(text, html, markdown){
  emailStore.child('/partTime/emailA').update({ 
        text: text,
        html: html,
        markdown: markdown
      }, onComplete);
}


var setPartTimeEmailB= exports.setPartTimeEmailB = function(text, html, markdown){
  emailStore.child('/partTime/emailB').update({ 
        text: text,
        html: html,
        markdown: markdown
      }, onComplete);
}
