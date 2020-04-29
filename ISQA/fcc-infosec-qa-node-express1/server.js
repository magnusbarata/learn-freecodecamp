"use strict";

const express    = require("express");
const bodyParser = require("body-parser");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const mongo      = require("mongodb").MongoClient;
const routes     = require("./routes.js");
const auth       = require("./auth.js");

const app = express();

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to pug
app.set("view engine", "pug");

// User DB prep
const client = new mongo(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const db = client.db("userauth");
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Connected to database");

    auth(app, db);
    routes(app, db);
    
    // Listen to request
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});
