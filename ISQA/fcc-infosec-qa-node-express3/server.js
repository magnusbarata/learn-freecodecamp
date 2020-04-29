'use strict';

const express     = require('express');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const auth        = require('./app/auth.js');
const routes      = require('./app/routes.js');
const mongo       = require('mongodb').MongoClient;
const passport    = require('passport');
const cookieParser= require('cookie-parser')
const app         = express();
const http        = require('http').Server(app);
const sessionStore= new session.MemoryStore();
const io          = require('socket.io')(http);
const passportSocketIo = require('passport.socketio');

var cors = require('cors');
app.use(cors({optionSuccessStatus: 200})); 
fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));

const client = new mongo(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
    const db = client.db('userauth');
    if(err) console.log('Database error: ' + err);
  
    auth(app, db);
    routes(app);
      
    http.listen(process.env.PORT || 3000);

    //start socket.io code
    io.use(passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: 'express.sid',
      secret: process.env.SESSION_SECRET,
      store: sessionStore
    }));
  
    let currentUsers = 0;
    io.on('connection', socket => {
      console.log('user ' + socket.request.user.name + ' connected');
      ++currentUsers;
      io.emit('user', {name: socket.request.user.name, currentUsers, connected: true});
      
      //listening chat message
      socket.on('chat message', msg => {
        io.emit('chat message', {name: socket.request.user.name, message: msg});
      });
      
      socket.on('disconnect', () => {
        console.log('User disconnected');
        --currentUsers;
        io.emit('user', {name: socket.request.user.name, currentUsers, connected: false});
      });
    });
    //end socket.io code  
});
