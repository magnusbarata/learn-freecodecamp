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
//const https = require('https');
const request = require('request');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const getPrice = symbol => {
  const reqString = `https://repeated-alpaca.glitch.me/v1/stock/${symbol.toLowerCase()}/quote`;
  // Using https module
  /*return new Promise (resolve => https.get(reqString, res => {
    res.on('data', data => {
      const stockData = JSON.parse(data);
      resolve({stock: stockData.symbol, price: stockData.latestPrice});
    });
  }).on('error', err => console.log(`Stock price API error on ${symbol}: ${err}`)));*/
  
  // Using request module
  return new Promise (resolve => request(reqString, {json: true},
    (err, res, data) => { return err ?
      console.log(`Stock price API error on ${symbol}: ${err}`) : 
      resolve({stock: data.symbol, price: data.latestPrice});
    }));
}

const getLikes = (symbol, ip) => {
  return new Promise (resolve => MongoClient.connect(CONNECTION_STRING,
    {useNewUrlParser: true, useUnifiedTopology: true}, 
    (err, client) => {
      expect(err, 'db connection error').to.not.exist;
      client.db('stocklikes').collection('likes').findOneAndUpdate(
        {stock: symbol},
        {$addToSet: {likes: {$each: ip}}},
        {returnOriginal: false, upsert: true},
        (err, doc) => {
          if (err) return console.log(err);
          resolve(doc.value.likes.length)});
  }));
}

module.exports = function (app) {
  /* stock price API
   * Usage: GET https://repeated-alpaca.glitch.me/v1/stock/[symbol]/quote
   * Where: symbol = msft | goog | aapl | ... */
   
  app.route('/api/stock-prices')
    .get(function (req, res){
      // Register using public IP only
      if (!req.query.stock) res.status(400).type('text').send('missing stock name(s)');
      if (!Array.isArray(req.query.stock)) req.query.stock = [req.query.stock];
      var ip = (String(req.query.like) !== "true") ? [] :
        [(req.headers['x-forwarded-for'] || '').split(',').shift().trim() || 
        req.connection.remoteAddress || req.socket.remoteAddress || 
        req.connection.socket.remoteAddress];
      
      async function sendStockData() {
        let stockData = [];
        for (const symbol of req.query.stock) {
          let tkn = await getPrice(symbol);
          tkn.likes = await getLikes(tkn.stock, ip);
          stockData.push(tkn);
        }
        
        if (stockData.length === 1) return res.json({stockData: stockData[0]});
        else if (stockData.length === 2) {
          const relLikes = stockData[0].likes - stockData[1].likes;
          delete stockData[0].likes; delete stockData[1].likes;
          stockData[0].rel_likes = relLikes;
          stockData[1].rel_likes = -relLikes;
          res.json({stockData: stockData});
        } else {
          res.status(400).type('text').send('max number of stock names is 2');
        }
      };
      sendStockData();

    });
    
};