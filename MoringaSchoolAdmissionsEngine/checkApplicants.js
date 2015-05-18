var wufoo = require('./wufoo/wufoo');
var createApplicant = require('./createApplicant');

var checkNew = function() {
  wufoo.getEntries(function(results) {
    results.Entries.forEach(function(entry) {
      var applicant = {
        firstName: entry.Field12,
        lastName: entry.Field13,
        email: entry.Field2,
        phone: entry.Field4,
        partTime: entry.Field18,
        fullTime: entry.Field19,
        interests: entry.Field7,
        experience: entry.Field8,
        contacted: false        
      }; 
      createApplicant(applicant);
    });
  });
};

checkNew();
setInterval(function() {
  checkNew();
}, 180000);
