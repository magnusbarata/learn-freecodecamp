// server.js
// where the node app starts
const express = require('express');
const app = express();

// enable CORS so that the API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// make all the files in 'public' available
app.use(express.static('public'));

// Basic routing
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

// Route for APIs
app.use('/api/timestamp', require('./apis/timestamp'));
app.use('/api/whoami', require('./apis/whoami'));
app.use('/api/shorturl', require('./apis/shorturl'));
app.use('/api/exercise', require('./apis/exercise'));
app.use('/api/fileanalyse', require('./apis/fileanalyse'));

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'});
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res.status(errCode).type('txt')
    .send(errMessage);
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
