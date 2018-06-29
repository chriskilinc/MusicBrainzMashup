const validator = require('validator');
const axios = require('axios');

async function getArtist(req, res, next) {
  // res.end();
  const mbid = req.params.id;

  if (validator.isUUID(mbid)) {
    try {
      let artist = await fetchArtistFromMusicBrainz(mbid);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(artist));
    } catch (error) {
      console.log(error);
    }
  } else {
    res
      .status(404)
      .send(`'${mbid}' is not an accepted Music Brainz Identifier`);
  }
}
module.exports = { getArtist };

//  MusicBrainz Utils

function fetchArtistFromMusicBrainz(mbid) {
  const apiUrl = 'http://musicbrainz.org/ws/2/';
  return axios
    .get(`${apiUrl}artist/${mbid}?inc=release-groups+url-rels&fmt=json`)
    .then(artist => {
      console.log(artist.data.relations);
      return createArtistObject(artist);
    });
}

function createArtistObject(artist) {
  return {
    mbid: artist.data.id,
    name: artist.data.name,
    type: artist.data.type,
    country: artist.data.area.name,
    albums: filterArtistReleasesToIncludeAlbums(
      artist.data['release-groups'],
      true
    )
    //  If more than just releases with the type 'Albums' should be returned, this will work
    // 'other-releases': filterArtistReleasesToIncludeAlbums(
    //   artist.data['release-groups'],
    //   false
    // )
  };
}

filterArtistReleasesToIncludeAlbums = (release, toInclude) => {
  return release
    .filter(
      release =>
        (release['primary-type'].toLowerCase() === 'album') === toInclude
    )
    .map(release => {
      return (release = {
        title: release.title,
        id: release.id,
        'first-released': release['first-release-date'],
        type: release['primary-type']
      });
    });
};
