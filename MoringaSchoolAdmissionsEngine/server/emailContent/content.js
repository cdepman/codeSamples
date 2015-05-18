var Firebase = require('firebase');
var fireBaseConfig = require('../../config').firebase;
var Promise = require('bluebird');

var emailContentDB = new Firebase(fireBaseConfig.dbAddress);

emailContentDB.authWithCustomToken(fireBaseConfig.AUTH_TOKEN, function(error, result) {
  if (error) { console.log("Login Failed!", error); } 
  else { console.log("Authenticated successfully!"); }
});

var genAB = function(){
  var flip = false;
  return function(){
    flip = !flip;
    return flip ? 'emailA' : 'emailB';
  }
}
var ABGen = genAB();

var fetchEmailContent = exports.fetchEmailContent = function(emailType){
  var AorB = ABGen();
  return new Promise(function(resolve, reject){
    try {
      emailContentDB.child('/' + emailType + '/' + AorB)
        .once('value', function(data){
          resolve([data.val(), AorB]);
        });
    } catch(err){
      reject(err);
    }
  });
};