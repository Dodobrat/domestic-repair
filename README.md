## HOW TO RUN

1. `npm i` to install all dependencies
2. `npm run acceptance` to run acceptance tests
3. `npm test` to see test coverage
4. `npm run linter` to see code quality (eslint results)
5. `npm run jsdoc` to generate documentation about all available methods
6. `nodemon index` to run the server

You can view and play around with the website after you have ran nodemon command at : __http://localhost:5000__

## IF ERRORS OCCUR WHEN TRYING TO DOWNLOAD A PDF

FIX - manually create a folder `pdfs` in `public` folder

final path should be - `public/pdfs`

## EMAILS DON'T WORK ON UNIVERSITY NETWORK !!!

To send emails change the variables `mailUser`, `mailPass`, `mailHost` and `mailPort` in `__DIRNAME__/Mail/mailer.js` to your Mailtrap or any other mailing service

# ENJOY :)
