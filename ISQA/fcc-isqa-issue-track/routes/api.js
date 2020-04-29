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
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  app.route('/api/issues/:project')
    
    .get(function (req, res){
      var project = req.params.project;
      if (req.query._id) req.query._id = new ObjectId(req.query._id);
      if (req.query.open)  
        req.query.open.toLowerCase() == "true" ? req.query.open = true : req.query.open = false;
      
    MongoClient.connect(CONNECTION_STRING,
      {useNewUrlParser: true, useUnifiedTopology: true}, 
      (err, client) => {
        const collection = client.db('issuetracker').collection(project);
        collection.find(req.query).toArray((err, docs) => 
          err ? res.send(err) : res.json(docs)
        );
      });
    })
  
    .post(function (req, res){
      var project = req.params.project;
      if (!(req.body.issue_title && req.body.issue_text && req.body.created_by))
        return res.status(400).type('text').send('missing required field(s)');
      
      MongoClient.connect(CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
          const collection = client.db('issuetracker').collection(project);
          collection.insertOne(
            {issue_title: req.body.issue_title,
             issue_text: req.body.issue_text,
             created_on: new Date(),
             updated_on: new Date(),
             created_by: req.body.created_by,
             assigned_to: req.body.assigned_to || '',
             open: true,
             status_text: req.body.status_text || ''
            }, 
            (err, doc) => err ? res.send(err) : res.json(doc.ops[0]));
        });
    })

    .put(function (req, res){
      var project = req.params.project;
      
      var _id = req.body._id;
      delete req.body._id;
      for (var key in req.body) 
        if (!req.body[key]) delete req.body[key]
      if (Object.keys(req.body).length == 0)
        return res.send('no updated field sent');
      //if (req.body.open) req.body.open = String(req.body.open) == "true";
      if (req.body.open)  
        req.body.open.toLowerCase() == "true" ? req.body.open = true : req.body.open = false;
      
      MongoClient.connect(CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
        const collection = client.db('issuetracker').collection(project);
        req.body.updated_on = new Date();
        collection.findOneAndUpdate({_id: new ObjectId(_id)}, {$set: req.body},
          err => err ?             
            res.send('could not update ' + _id) : res.send('successfully updated'));
      });
    })
  
    .delete(function (req, res){
      var project = req.params.project;
      if (!req.body._id) return res.send('_id error');
      
      MongoClient.connect(CONNECTION_STRING,
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, client) => {
          const collection = client.db('issuetracker').collection(project);
          collection.deleteOne({_id: new ObjectId(req.body._id)}, 
            err => err ? 
              res.send('could not delete ' + req.body._id) : res.send('deleted ' + req.body._id));
      });
    });

};
