const expect = require('chai').expect;
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

function ReplyHandler() {
  this.showAll = function(req, res) {
    if (!req.query.thread_id)
      return res.status(400).type('text').send('missing thread id');
    
    mongo.connect(process.env.DB,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
        expect(err, 'db connection error').to.not.exist;
        const collection = client.db('msgboard').collection(req.params.board);
        collection.findOne(
          {_id: new ObjectID(req.query.thread_id)}, 
          {projection: {reported: 0, delete_pw: 0, 'replies.reported': 0, 'replies.delete_pw': 0}},
          (err, thread) => err ? res.send(err) : res.json(thread));
      });
  }
  
  this.create = function(req, res) {
    if (!(req.body.thread_id && req.body.text && req.body.delete_password))
      return res.status(400).type('text').send('missing required field(s)');
    
    const reply = {_id: new ObjectID(),
                   text: req.body.text,
                   created_on: new Date(),
                   reported: false,
                   delete_pw: req.body.delete_password};
    
    mongo.connect(process.env.DB,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
        expect(err, 'db connection error').to.not.exist;
        const collection = client.db('msgboard').collection(req.params.board);
        collection.findOneAndUpdate(
          {_id: new ObjectID(req.body.thread_id)},
          {$set: {bumped_on: new Date()}, $push: {replies: {$each: [reply], $position: 0}}},
          (err, doc) => err ?
            console.log(err) :
            res.redirect(`/b/${req.params.board}/${req.body.thread_id}`));
      });
  }
  
  this.report = function(req, res) {
    if (!(req.body.thread_id && req.body.reply_id))
      return res.status(400).type('text').send('missing required field(s)');
    
    mongo.connect(process.env.DB,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
        expect(err, 'db connection error').to.not.exist;
        const collection = client.db('msgboard').collection(req.params.board);
        collection.findOneAndUpdate(
          {_id: new ObjectID(req.body.thread_id),
           replies: {$elemMatch: {_id: new ObjectID(req.body.reply_id)}}
          },
          {$set: {'replies.$.reported': true}},
          err => err ? res.send(err) : res.send('success'));
    });
  }
  
  this.delete = function(req, res) {
    if (!(req.body.thread_id && req.body.reply_id && req.body.delete_password))
      return res.status(400).type('text').send('missing required field(s)');
    
    mongo.connect(process.env.DB,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err, client) => {
        expect(err, 'db connection error').to.not.exist;
        const collection = client.db('msgboard').collection(req.params.board);
        collection.findOneAndUpdate(
          {_id: new ObjectID(req.body.thread_id),
           replies: {$elemMatch: {
             _id: new ObjectID(req.body.reply_id),
             delete_pw: req.body.delete_password}
            }
          },
          {$set: {'replies.$.text': '[deleted]'}},
          (err, reply) => {
            expect(err, 'find thread(s) error').to.not.exist;
            !reply.value ? res.send('incorrect password') : res.send('success');
          });
    });
  }
}

module.exports = ReplyHandler;