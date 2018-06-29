async function getArtistFromMusicBrainz(req, res, next) {
  // res.end();
  const mbid = req.params.id;

  if (false) {
    try {
      // let artist = await getArtistFromMusicBrainz(mbid);

      let myJson = {
        id: mbid
      };
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(myJson));
    } catch (error) {
      console.log(error);
    }
  } else {
    res
      .status(404)
      .send(`'${mbid}' is not an accepted Music Brainz Identifier`);
  }
}
module.exports = { getArtistFromMusicBrainz };
