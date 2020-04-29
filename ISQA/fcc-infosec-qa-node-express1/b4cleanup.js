'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const session     = require('express-session');
const passport    = require('passport');
const mongo       = require('mongodb').MongoClient;
const bcrypt      = require('bcrypt');

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to pug
app.set('view engine', 'pug');

// Initialize session and passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// User DB prep
mongo.connect(process.env.MONGO_URI, (err, db) => {
  //let db = client.db('userauth');
  if (err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Connected to database');
    
    // Serialize-Deserialize user
    const ObjectID = require('mongodb').ObjectID;
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
      db.collection('users').findOne({_id: new ObjectID(id)}, 
          (err, doc) => {
            done(null, doc);
          });
    });
    
    // Authentication strategy
    const LocalStrategy = require('passport-local');
    passport.use(new LocalStrategy(
      (username, password, done) => {
        db.collection('users').findOne({username: username}, (err, user) => {
          console.log('User ' + username + ' attempted to log in.');
          if (err) return done(err);
          if (!user) return done(null, false);
          //if (password !== user.password) return done(null, false);
          if (!bcrypt.compareSync(password, user.password)) return done(null, false);
          return done(null, user);
        });
      }));
    
    app.get('/', (req, res) => {
      res.render(process.cwd()  + '/views/pug/index', 
        {title: 'Home Page', message: 'Please login', showLogin: true, showRegistration: true});
    });
    
    // Authenticate user
    app.post('/login', passport.authenticate('local', {failureRedirect: '/'}),
        (req, res) => {
          res.redirect('/profile');
    });
    
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/');
    }
    
    app.get('/profile', ensureAuthenticated, (req, res) => {
      res.render(process.cwd() + '/views/pug/profile', {username: req.user.username});
    });
    
    // Logout routine
    app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/');
    });
    
    // Register a user
    app.post('/register', (req, res, next) => {
      db.collection('users').findOne({username: req.body.username}, (err, user) => {
        if (err) next(err);
        else if (user) res.redirect('/');
        else {
          let hash = bcrypt.hashSync(req.body.password, 12);
          db.collection('users').insertOne(
            {username: req.body.username, password: hash},
            (err, doc) => {
              if (err) res.redirect('/');
              else next(null, user);
          });
        }
      });
    }, passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
          res.redirect('/profile');
    });
    
    // Missing page handler
    app.use((req, res, next) => {
      res.status(404).type('text').send('Not Found');
    });
    
    // Listen to request
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});