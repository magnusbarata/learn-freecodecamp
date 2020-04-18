// The code for user exercise logger api
const exerRouter = require('express').Router();

// Bodyparser
const bodyParser = require('body-parser');
exerRouter.use(bodyParser.urlencoded({extended: false}));
exerRouter.use(bodyParser.json());

// Database prep
const shortid = require('shortid');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  _id: {type: String, index: true, default: shortid.generate},
  uname: {type: String, required: true, unique: true}
});
const Users = mongoose.model('Users', userSchema);

const exerciseSchema = new mongoose.Schema({
  userId: {type: String, ref: 'Users', index: true},
  username: String,
  description: {type: String, required: true},
  duration: {type: Number, required: true, min: [1, 'duration too short']},
  date: {type: Date, default: Date.now}
});
const Exercises = mongoose.model('Exercises', exerciseSchema);

// Create new user API
exerRouter.post('/new-user', (req, res, next) => {
  (new Users({uname: req.body.username})).save((err, newUser) => {
    if (err) {
      if (err.code == 11000) return next({
        status: 400,
        message: 'username already taken'});
      else return next(err);
    } 
    res.json({username: newUser.uname, _id: newUser._id});
  });
});

// Show all users API
exerRouter.get('/users', (req, res, next) => {
  Users.find({}, (err, allUsers) => {
    if (err) return next(err);
    res.json(allUsers);
  });
});

// Add exercise API
exerRouter.post('/add', (req, res, next) => {
  Users.findById(req.body.userId, (err, user) => {
    if (err) return next(err);
    if (!user) return next({status: 400, message: 'userId does not exist'});
    
    const exer = new Exercises(req.body);
    exer.username = user.uname;
    if (!exer.date) exer.date = Date.now();
    exer.save((err, newExer) => {
      if (err) return next(err);
      newExer = newExer.toObject(); // Cannot edit without converting
      newExer._id = newExer.userId;
      newExer.date = newExer.date.toDateString(); // won't pass test w/o converting!!
      delete newExer.__v;
      delete newExer.userId;
      res.json(newExer);
    });
  });
});

// User exercise log API
exerRouter.get('/log', (req, res, next) => {
  Users.findById(req.query.userId, (err, user) => {
    if (err) return next(err);
    if (!user) return next({status: 400, message: 'userId does not exist'});
    
    Exercises.find({
        userId: req.query.userId,
        date: {
          $gt: req.query.from != undefined ? new Date(req.query.from) : 0,
          $lt: req.query.from != undefined ? new Date(req.query.to) : Date.now()
        }})
      .limit(parseInt(req.query.limit))
      .exec((err, exers) => {
        if (err) return next(err);
        res.json({
          _id: req.query.userId,
          username: user.username,
          count: exers.length,
          log: exers.map(elm => ({
            description: elm.description,
            duration: elm.duration,
            date: elm.date
          }))
        });
      });
  });
});

module.exports = exerRouter;