// The code for url shortener api
const shurlRouter = require('express').Router();

// Bodyparser
const bodyParser = require('body-parser');
shurlRouter.use(bodyParser.urlencoded({extended: false}));

/* Hash generator (following java implementation, which is then converted into hex).
   It isn't used this time. In exchange, we use shortid. */
String.prototype.hashCode = function() {
  let hash = 0;
  for (let c of this)
    hash = Math.imul(31, hash) + c.charCodeAt(0) | 0;
  return hash.toString(16);
}

const shortid = require('shortid');

// Database prep
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const urlSchema = new mongoose.Schema({
  origin: {type: String, required: true, unique: true},
  short: {type: String, index: true, default: shortid.generate},
});
const Url = mongoose.model('Url', urlSchema);

// Creating new url
shurlRouter.post('/new', function(req, res, next) {
  // Check the url valid or not
  try {
    var inputUrl = new URL(req.body.url);
  } catch(e) {
    return next({message: 'invalid URL'});
  }
  // Remove the final slash on url
  if (inputUrl.href.match(/\/$/i))
    inputUrl.href = inputUrl.href.slice(0,-1);
  
  // Check the dns valid or not
  const dns = require('dns');
  dns.lookup(inputUrl.host, function(err, addr, fam) {
    if (err) return next({message: 'invalid hostname'});
    
    // Check if the url already registered or not
    const urlPrefix = req.protocol + '://' + req.hostname + '/api/shorturl/';
    Url.findOne({origin: inputUrl}, (err, url) => {
      if (err) return next(err);
      if (url) return res.json({origin: url.origin, short: urlPrefix + url.short});
      
      // Register if not exist
      (new Url({origin: inputUrl})).save((err, newUrl) => {
        if (err) return next(err);
        res.json({origin: newUrl.origin, short: urlPrefix + newUrl.short});
      });
    });
  });
});

// Accessing shortened url
shurlRouter.get('/:shorturl', function(req, res, next) {
  Url.findOne({short: req.params.shorturl}, (err, url) => {
      if (err) return next({message: 'error fetching your short url'});
      if (url) res.redirect(url.origin);
      else return next({message: 'URL not found...'});
  });
});

module.exports = shurlRouter;