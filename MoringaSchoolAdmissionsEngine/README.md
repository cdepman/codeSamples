**Moringa School Admissions Email Automator**

***/applicants:***
Periodically reads entries from wufoo API (checkApplicants.js), then delegates tasks (createApplicant.js) for creating new applicants entries based on Wufoo data.

***/emailContent:***
Fetches email content from Firebase to send to new applicant

***/mailer:***
Sends emails to new applicants through Gmail

***/spreadsheets:***
Updates applicant entries on Google spreadsheets through Google Spreadsheets API

***/socketConnection:***
Sets up socket listeners for actions from client (email template editor) interacting with Firebase

***/db:***
Sets up database connections, methods and models