var mongoose = require('mongoose');
var config = require('../config').mongo;
var Schema = mongoose.Schema;
var _ = require('lodash');
var Promise = require('bluebird');

// db setup
mongoose.connect(config.path);
var db = exports.db = mongoose.connection;

db.on('error', console.log.bind(console, 'Error'));

db.on('open', function(cb) {
  console.log('Mongo Connection Successful.');
});

var fullTimeApplicantSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  interests: String,
  experience: String,
  type: String,
  contacted: Boolean,
  fullTime: String,
  partTime: String
}, { collection : 'applicants' });

var partTimeApplicantSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  interests: String,
  experience: String,
  type: String,
  contacted: Boolean,
  fullTime: String,
  partTime: String
}, { collection : 'part_time_applicants' });



var FullTimeApplicant = exports.FullTimeApplicant = mongoose.model('FullTimeApplicant', fullTimeApplicantSchema);
var PartTimeApplicant = exports.PartTimeApplicant = mongoose.model('PartTimeApplicant', partTimeApplicantSchema);

var getFullTimeApplicant = exports.getFullTimeApplicant = function(params) {
  return new Promise(function(resolve, reject) {
    params = _.pick(params, [
      'email'
    ]);

    FullTimeApplicant.find(params, function(err, docs) {
      if (err) {
        reject(err);
        return;
      }
      resolve(docs);
    });
  });
};

var getPartTimeApplicant = exports.getPartTimeApplicant = function(params) {
  return new Promise(function(resolve, reject) {
    params = _.pick(params, [
      'email'
    ]);

    PartTimeApplicant.find(params, function(err, docs) {
      if (err) {
        reject(err);
        return;
      }
      resolve(docs);
    });
  });
};

var newFullTimeApplicant = exports.newFullTimeApplicant = function(params) {
  return new Promise(function(resolve, reject) {
    params = _.pick(params, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'interests',
      'experience',
      'type',
      'fullTime',
      'partTime'
    ]);

    getFullTimeApplicant({email: params.email})
    .then(function(user) {
      if (user.length === 0) {
        new FullTimeApplicant(params).save(function(err, user) {
          if (err) {
            reject(err);
            return;
          }
          resolve(user);
        });
        return;
      }
      reject('User already Applied');
    })
    .catch(reject);
  });
};

var newPartTimeApplicant = exports.newPartTimeApplicant = function(params) {
  return new Promise(function(resolve, reject) {
    params = _.pick(params, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'interests',
      'experience',
      'type',
      'fullTime',
      'partTime'
    ]);

    getPartTimeApplicant({email: params.email})
    .then(function(user) {
      if (user.length === 0) {
        new PartTimeApplicant(params).save(function(err, user) {
          if (err) {
            reject(err);
            return;
          }
          resolve(user);
        });
        return;
      }
      reject('User already Applied');
    })
    .catch(reject);
  });
};

var updateFullTime = exports.updateFullTime = function(email, params) {
  return new Promise(function(resolve, reject) {
    params = _.pick(params, [
      'type'
    ]);
    FullTimeApplicant.findOneAndUpdate({email: email}, params, function(err, docs) {
      if (err) {
        reject(err);
        return;
      }
      resolve(docs);
    });
  });
};

var updatePartTime = exports.updatePartTime = function(email, params) {
  return new Promise(function(resolve, reject) {
    params = _.pick(params, [
      'type'
    ]);
    PartTimeApplicant.findOneAndUpdate({email: email}, params, function(err, docs) {
      if (err) {
        reject(err);
        return;
      }
      resolve(docs);
    });
  });
};