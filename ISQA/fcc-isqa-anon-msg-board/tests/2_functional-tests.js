/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var thread1, thread2, reply;
  const PW = 'password';
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('submit threads', function(done){
        chai.request(server)
          .post('/api/threads/testboard')
          .send({text: 'Chai Test', delete_password: PW})
          .end((err, res) => assert.equal(res.status, 200));
        chai.request(server)
          .post('/api/threads/testboard')
          .send({text: 'Chai Test [to delete]', delete_password: PW})
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });
    
    suite('GET', function() {
      test('get threads', function(done){
        chai.request(server)
          .get('/api/threads/testboard')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            assert.property(res.body[0], '_id');
            thread1 = res.body[0]._id;
            thread2 = res.body[1]._id;
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'text');
            assert.isArray(res.body[0].replies);
            assert.isAtMost(res.body[0].replies.length, 3);
            assert.notProperty(res.body[0], 'reported');
            assert.notProperty(res.body[0], 'delete_pw');
            done();
          });
      });
    });
    
    suite('DELETE', function() {
      test('delete thread1', function(done){
        chai.request(server)
          .delete('/api/threads/testboard')
          .send({thread_id: thread1, delete_password: PW})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
      
      test('wrong delete password on deleting thread2', function(done){
        chai.request(server)
          .delete('/api/threads/testboard')
          .send({thread_id: thread2, delete_password: 'YouShallNotPass'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done();
          });
      });
    });
    
    suite('PUT', function() {
      test('report thread2', function(done){
        chai.request(server)
          .put('/api/threads/testboard')
          .send({thread_id: thread2})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('submit reply to thread2', function(done){
        chai.request(server)
          .post('/api/replies/testboard')
          .send({thread_id: thread2, text: 'reply message', delete_password: PW})
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });
    
    suite('GET', function() {
      test('get reply', function(done){
        chai.request(server)
          .get(`/api/replies/testboard?thread_id=${thread2}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'bumped_on');
            assert.notProperty(res.body, 'reported');
            assert.notProperty(res.body, 'delete_pw');
            assert.isArray(res.body.replies);
            assert.property(res.body.replies[0], '_id');
            reply = res.body.replies[0]._id;
            assert.property(res.body.replies[0], 'text');
            assert.property(res.body.replies[0], 'created_on');
            assert.notProperty(res.body.replies[0], 'reported');
            assert.notProperty(res.body.replies[0], 'delete_pw');
            done();
          });
      });
    });
    
    suite('PUT', function() {
      test('report reply', function(done){
        chai.request(server)
          .put('/api/replies/testboard')
          .send({thread_id: thread2, reply_id: reply})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });
    
    suite('DELETE', function() {
      test('wrong delete password on deleting reply', function(done){
        chai.request(server)
          .delete('/api/replies/testboard')
          .send({thread_id: thread2, reply_id: reply, delete_password: 'YouShallNotPass'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done();
          });
      });
      
      test('delete reply on thread2', function(done){
        chai.request(server)
          .delete('/api/replies/testboard')
          .send({thread_id: thread2, reply_id: reply, delete_password: PW})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });
    
  });

});
