const { isUuid } = require('../utilities/validators');
const { fetchArtistFromMusicBrainz } = require('../utilities/musicBrainz');
const { fetchDescFromWikipedia } = require('../utilities/wikipedia');
const { fetchCoverArt } = require('../utilities/coverArtArchive');

async function getArtist(req, res) {
  const mbid = req.params.id;
  res.setHeader('Content-Type', 'application/json');

  if (!isUuid(mbid)) {
    res.status(400).send(
      JSON.stringify({
        error: {
          message: `'${mbid}' is not an accepted Music Brainz Identifier`
        }
      })
    );
    throw new Error('Parameter is not a Valid UUID');
  }

  try {
    //  Fetches Aritst from MusicBrains and Returns a Artist Object
    let artistModel = await fetchArtistFromMusicBrainz(mbid);

    //  Fetches Wikipedia and returns a short description
    const artistDescription = fetchDescFromWikipedia(artistModel.wikipediaUrl);
    //  Fetches CoverArtArchive and returns Album Art for each Album in artistModel
    const albumCoverArt = artistModel.albums.map(async album => {
      let image = await fetchCoverArt(album.id);
      return { ...album, image };
    });

    //    Without PROMISE ALL
    // artist.description = artistDescription;
    // let mapedAlbumCovers = await Promise.all([...albumCoverArt]);
    // artist.albums = [...mapedAlbumCovers];

    //    PROMISE ALL - Almost 1000ms faster than Without
    await Promise.all([artistDescription, ...albumCoverArt]).then(res => {
      artistModel.description = res[0];
      artistModel.albums = [...res].slice(1);
      delete artistModel.wikipediaUrl;
    });

    res.send(JSON.stringify(artistModel));
  } catch (error) {
    // console.log(error.response.data);
    res
      .status(500)
      .send(
        JSON.stringify({
          error: {
            message: 'Unexpected Error'
          }
        })
      )
      .end();
  }
}
module.exports = { getArtist };
