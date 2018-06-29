const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Root');
});

module.exports = router;
