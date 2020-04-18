// The code for request header parser api
const whoamiRouter = require('express').Router();

whoamiRouter.get('', (req, res) => {
  res.json({
    ipaddress: req.ip.match(/(\d+\.){3}\d+/)[0],
    language: req.get('Accept-Language'),
    software: req.get('User-Agent')
  });
});

module.exports = whoamiRouter;