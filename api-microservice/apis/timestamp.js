// The code for timestamp api
const tsRouter = require('express').Router();

const timestamp = (datetime) => {
  return {unix: datetime.getTime(), utc: datetime.toUTCString()};
};

tsRouter.get('/', (req, res) => {
  res.json(timestamp(new Date()));
});

tsRouter.get('/:date_string', (req, res) => {
  let ts = /^\d+-\d+-\d+$/.test(req.params.date_string) ?
    timestamp(new Date(req.params.date_string)):
    timestamp(new Date(Number(req.params.date_string)));
  
  !ts.unix ?
    res.json({error: ts.utc}):
    res.json(ts);
});

module.exports = tsRouter;