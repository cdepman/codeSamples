var Spreadsheet = require('edit-google-spreadsheet');
var config = require('../../config').mail;


var GoogleDoc = function() {
  this.queue = [];
  this.isRunning = false;
};

GoogleDoc.prototype.add = function(params) {
  this.queue.push(params);
  if (this.isRunning === false) {
    this.addNextApplicant();
  }
};

GoogleDoc.prototype.addNextApplicant = function() {
  var Google = this;
  Google.isRunning = true;
  if (Google.queue.length === 0) {
    return;
  }
  var params = Google.queue.shift();
  Spreadsheet.load({
    debug: true,
    spreadsheetId: params.sheets,
    worksheetName: 'Sheet1',
    username: config.email,
    password: config.password
  }, function sheetReady(err, spreadsheet) {
    if (err) {
      console.log('there is an err:', err);
      return;
    }

    spreadsheet.receive(function(err, rows, info) {
      if(err) throw err;
      console.log("Found rows:", info);
      add(info.nextRow);
    });

    var add = function(row) {
      var newRow = {}
      newRow[row] = {
        1: params.firstName,
        2: params.lastName,
        3: params.email,
        4: params.phone,
        6: params.interests,
        7: params.experience,
        9: params.type,
        10: new Date().toString()
      };
      spreadsheet.add(newRow);
      
      spreadsheet.send(function(err) {
        if (err) {
          console.log(err);
          return;
        }
        if (Google.queue.length > 0) {
          console.log('Updated at correct row for applicant:', newRow[row]);
          Google.addNextApplicant();
        } else if (Google.queue.length === 0) {
          Google.isRunning = false;
          console.log('Updated at correct row for applicant:', newRow[row]);
        }
      });
    };
  });
};

module.exports = new GoogleDoc();
