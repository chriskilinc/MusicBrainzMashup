const router = require('express').Router();

router.get('/:id', (req, res) => {
  res.send('Artist' + req.params.id);
});

module.exports = router;
