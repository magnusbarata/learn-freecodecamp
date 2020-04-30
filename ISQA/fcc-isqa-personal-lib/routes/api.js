/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
          expect(err, 'connection error').to.not.exist;
          client.db('library').collection('books').find({}).toArray(
            (err, books) => {
              expect(err, 'database find error').to.not.exist;
              expect(books).to.exist;
              expect(books).to.be.a('array');
              if (err) return res.send(err);
              res.json(books.map(b => {
                return {_id: b._id, title: b.title, commentcount: b.comments.length}}));
            });
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (!title) return res.status(400).type('text').send('missing title');
      expect(title, 'posted title').to.be.a('string');
      //response will contain new book object including atleast _id and title
      MongoClient.connect(MONGODB_CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
          expect(err, 'connection error').to.not.exist;
          client.db('library').collection('books').insertOne(
            {title: title, comments: []},
            (err, book) => err ? res.send(err) : res.json(book.ops[0]));
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
          expect(err, 'connection error').to.not.exist;
          client.db('library').collection('books').deleteMany({},
            (err, stat) => err ? res.send(err) : res.send('complete delete successful'));
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      if (!bookid) res.status(400).type('text').send('missing bookid');
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      MongoClient.connect(MONGODB_CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
          expect(err, 'connection error').to.not.exist;
          client.db('library').collection('books').findOne({_id: new ObjectId(bookid)}, 
            (err, doc) => {
              if (err) return res.send(err);
              else if (!doc) return res.send('no book exists');
              res.json(doc);
            });
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      if (!bookid) res.status(400).type('text').send('missing bookid');
      //json res format same as .get
      MongoClient.connect(MONGODB_CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
          expect(err, 'connection error').to.not.exist;
          client.db('library').collection('books').findOneAndUpdate(
            {_id: new ObjectId(bookid)},
            {$push: {comments: comment}},
            {returnOriginal: false},
            (err, doc) => {
              if (err) return res.send(err);
              else if (!doc.value) return res.send('no book exists');
              res.json(doc.value);
            });
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      if (!bookid) res.status(400).type('text').send('missing bookid');
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
          expect(err, 'connection error').to.not.exist;
          client.db('library').collection('books').deleteOne({_id: new ObjectId(bookid)},
            (err, stat) => err ? res.send('no book exists') : res.send('delete successful'));
      });
    });
  
};
