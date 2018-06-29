const router = require('express').Router();
const controllerArtist = require('../controllers/artist');

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify('api/artist/id'));
});

router.get('/:id', controllerArtist.getArtistFromMusicBrainz);

module.exports = router;
