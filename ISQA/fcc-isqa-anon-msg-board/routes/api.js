/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var ThreadHandler = require('../handlers/thread.js');
var ReplyHandler = require('../handlers/reply.js');

module.exports = function (app) {
  var threadHandler = new ThreadHandler();
  app.route('/api/threads/:board')
    .get(threadHandler.list)
    .post(threadHandler.create)
    .put(threadHandler.report)
    .delete(threadHandler.delete);
  
  var replyHandler = new ReplyHandler();
  app.route('/api/replies/:board')
    .get(replyHandler.showAll)
    .post(replyHandler.create)
    .put(replyHandler.report)
    .delete(replyHandler.delete);

};
