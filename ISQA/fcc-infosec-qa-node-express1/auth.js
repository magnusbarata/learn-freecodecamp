const session = require("express-session");
const passport = require("passport");
const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

module.exports = function(app, db) {
  // Initialize session and passport
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Serialize-Deserialize user
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    db.collection("users").findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  // Authentication strategy
  passport.use(
    new LocalStrategy((username, password, done) => {
      db.collection("users").findOne({ username: username }, (err, user) => {
        console.log("User " + username + " attempted to log in.");
        if (err) return done(err);
        if (!user) return done(null, false);
        if (!bcrypt.compareSync(password, user.password)) return done(null, false);
        return done(null, user);
      });
    })
  );
};
