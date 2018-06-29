const router = require('express').Router();

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify('api/artist/id'));
});

router.get('/:id', (req, res) => {
  res.send('Artist' + req.params.id);
});

module.exports = router;
