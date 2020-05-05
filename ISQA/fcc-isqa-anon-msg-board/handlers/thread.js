const expect = require('chai').expect;
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

function ThreadHandler() {
  this.list = function(req, res) {
    mongo.connect(process.env.DB,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
        expect(err, 'db connection error').to.not.exist;
        const collection = client.db('msgboard').collection(req.params.board);
        collection.find(
           {}, {projection: {reported: 0, delete_pw: 0, 'replies.reported': 0, 'replies.delete_pw': 0}})
          .sort({bumped_on: -1})
          .limit(10)
          .toArray((err, threads) => {
            expect(err, 'find thread(s) error').to.not.exist;
            threads.forEach(t => {
              t.replycount = t.replies.length;
              if (t.replycount > 3) t.replies = t.replies.slice(-3);
            });
            res.json(threads);
        });
      });
  }
  
  this.create = function(req, res) {
    if (!(req.body.text && req.body.delete_password))
      return res.status(400).type('text').send('missing required field(s)');
    
    mongo.connect(process.env.DB,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
        expect(err, 'db connection error').to.not.exist;
        const collection = client.db('msgboard').collection(req.params.board);
        collection.insertOne(
          {text: req.body.text,
           created_on: new Date(),
           bumped_on: new Date(),
           reported: false,
           delete_pw: req.body.delete_password,
           replies: []
          },
          (err, doc) => err ? console.log(err) : res.redirect(`/b/${req.params.board}/`));
      });
  }
  
  this.report = function(req, res) {
    if (!req.body.thread_id)
      return res.status(400).type('text').send('missing thread id');
    
    mongo.connect(process.env.DB,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
        expect(err, 'db connection error').to.not.exist;
        const collection = client.db('msgboard').collection(req.params.board);
        collection.findOneAndUpdate(
          {_id: new ObjectID(req.body.thread_id)},
          {$set: {reported: true}},
          err => err ? res.send(err) : res.send('success'));
    });
  }
  
  this.delete = function(req, res) {
    if (!(req.body.thread_id && req.body.delete_password))
      return res.status(400).type('text').send('missing required field(s)');
    
    mongo.connect(process.env.DB,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
        expect(err, 'db connection error').to.not.exist;
        const collection = client.db('msgboard').collection(req.params.board);
        collection.deleteOne(
          {_id: new ObjectID(req.body.thread_id), delete_pw: req.body.delete_password},
          (err, stat) => {
            expect(err, 'delete thread error').to.not.exist;
            stat.deletedCount !== 1 ? res.send('incorrect password') : res.send('success');
          });
    });
    
  }
}

module.exports = ThreadHandler;