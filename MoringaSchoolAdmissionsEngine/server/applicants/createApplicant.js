var mailer = require('../mailer/mailer');
var emailContent = require('../emailContent/content');
var mongo = require('../db/mongo');
var Google = require('../spreadsheets/spreadsheets');
var sheets = require('../../config').sheets;
var _ = require('lodash');

var createNew = exports = function(applicant) {
  applicant.partTime ? newPartTimeApplicant(applicant) : newFullTimeApplicant(applicant);
}

function newFullTimeApplicant(applicant){
  mongo.newFullTimeApplicant(applicant)
  .then(function(user) {
    emailContent.fetchEmailContent('fullTime')
    .spread(function(content, AorB){
      mailer.sendFullTimeEmail(content, applicant.firstName, applicant.email, AorB)
      .then(function(email) {
        mongo.updateFullTime(applicant.email, {type: email.type})
        .then(function(doc) {
          applicant.type = email.type;
          applicant.contacted = true;
          applicant.sheets = sheets.fullTime;
          Google.add(_.cloneDeep(applicant));
          console.log('Full-Time Email Sent and user updated!');
        })      
      })
      .catch(function(err) {
        console.log('Mongo Update Error:', err);
      });
    })
    .catch(function(err) {
      console.log('Full-Time Email Failure on Send:', err);
    });
  })
  .catch(function(err) {
    console.log('Email Failure on new:', err);
  });
}

function newPartTimeApplicant(applicant){
  mongo.newPartTimeApplicant(applicant)
  .then(function(user){
    emailContent.fetchEmailContent('partTime')
    .spread(function(content, AorB){
      mailer.sendFullTimeEmail(content, applicant.firstName, applicant.email, AorB)
      .then(function(email) {
        mongo.updateFullTime(applicant.email, {type: email.type})
        .then(function(doc) {
          applicant.type = email.type;
          applicant.contacted = true;
          applicant.sheets = sheets.partTime;
          Google.add(_.cloneDeep(applicant));
          console.log('Part-Time Email Sent and user updated!');
        })
      })
      .catch(function(err) {
        console.log('Mongo Update Error:', err);
      });
    })
    .catch(function(err) {
      console.log('Part-Time Email Failure on Send:', err);
    });
  })  
  .catch(function(err) {
    console.log('Email Failure on new:', err);
  });
}
