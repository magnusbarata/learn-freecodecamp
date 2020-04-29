const passport = require("passport");
const bcrypt = require("bcrypt");

module.exports = function(app, db) {
  app.get("/", (req, res) => {
    res.render(process.cwd() + "/views/pug/index", {
      title: "Home Page",
      message: "Please login",
      showLogin: true,
      showRegistration: true
    });
  });

  // Authenticate user
  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/profile");
    }
  );

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
  }

  app.get("/profile", ensureAuthenticated, (req, res) => {
    res.render(process.cwd() + "/views/pug/profile", {
      username: req.user.username
    });
  });

  // Logout routine
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Register a user
  app.post(
    "/register",
    (req, res, next) => {
      db.collection("users").findOne(
        { username: req.body.username },
        (err, user) => {
          if (err) next(err);
          else if (user) res.redirect("/");
          else {
            let hash = bcrypt.hashSync(req.body.password, 12);
            db.collection("users").insertOne(
              { username: req.body.username, password: hash },
              (err, doc) => {
                if (err) res.redirect("/");
                else next(null, user);
              }
            );
          }
        }
      );
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/profile");
    }
  );

  // Missing page handler
  app.use((req, res, next) => {
    res
      .status(404)
      .type("text")
      .send("Not Found");
  });
};
