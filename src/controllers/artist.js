const axios = require('axios');
const { isUuid } = require('../utilities/validators');

async function getArtist(req, res) {
  const mbid = req.params.id;
  res.setHeader('Content-Type', 'application/json');
  if (isUuid(mbid)) {
    try {
      //  Fetches Aritst from MusicBrains and Returns a Artist Object
      let artistModel = await fetchArtistFromMusicBrainz(mbid);

      //  Fetches Wikipedia and returns a short description
      const artistDescription = await fetchDescFromWikipedia(
        artistModel.wikipediaUrl
      );
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
      });

      res.send(JSON.stringify(artistModel));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send(JSON.stringify('Unexpected Error'))
        .end();
    }
  } else {
    res
      .status(400)
      .send(`'${mbid}' is not an accepted Music Brainz Identifier`);
  }
}
module.exports = { getArtist };

//  CoverArtArchve
async function fetchCoverArt(albumId) {
  const apiUrl = 'https://coverartarchive.org';
  const fetchUrl = `${apiUrl}/release-group/${albumId}`;
  try {
    return await axios.get(fetchUrl).then(response => {
      return response.data.images[0].image;
    });
  } catch (error) {
    return error.response.statusText;
  }
}

//  WikiPedia Utils
async function fetchDescFromWikipedia(wikipediaUrl) {
  const apiUrl = 'https://en.wikipedia.org/w/api.php';
  const wikiTitle = wikipediaUrl.replace(/.+?\/wiki\//, ''); //  Replaces everything that matches before /wiki/
  const fetchUrl = `${apiUrl}?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${wikiTitle}`;
  try {
    const response = await axios.get(fetchUrl);
    const wikiDescription = response.data.query.pages[
      Object.keys(response.data.query.pages)[0]
    ].extract
      .match(/.+?<\/p>/)
      .pop();
    return wikiDescription;
  } catch (error) {
    throw new Error('Could not fetch Wikipedia Api');
  }
}

//  MusicBrainz Utils

function fetchArtistFromMusicBrainz(mbid) {
  const apiUrl = 'http://musicbrainz.org/ws/2/';
  return axios
    .get(`${apiUrl}artist/${mbid}?inc=release-groups+url-rels&fmt=json`)
    .then(artist => {
      return createArtistObjectFromMusicBrainz(artist);
    });
}

function createArtistObjectFromMusicBrainz(artist) {
  return {
    mbid: artist.data.id,
    name: artist.data.name,
    description: '',
    // country: artist.data.area.name,
    wikipediaUrl: filterMusicBrainsArtistForRelationTypeUrl(
      artist,
      'wikipedia'
    ),
    albums: filterArtistReleasesToIncludeAlbums(artist, true)
  };
}

//  This function will return the relation URL for the Relation Type Parameter
function filterMusicBrainsArtistForRelationTypeUrl(mbArtist, relationType) {
  let filteredMbArtist = mbArtist.data.relations.filter(
    relation => relation.type == relationType
  )[0];

  if (filteredMbArtist) {
    return filteredMbArtist.url.resource;
  } else {
    return null;
  }
}

//  If passed FALSE, returns all types of releases EXCEPT releases with type 'album'
//  Can be used if want to return an object with 'other-releases'
//  It might be pleasant for the caller to know what kind of release they are fetching. Therefor 'type' should be available/returned
filterArtistReleasesToIncludeAlbums = (release, toInclude) => {
  return release.data['release-groups']
    .filter(
      release =>
        (release['primary-type'].toLowerCase() === 'album') === toInclude
    )
    .map(release => {
      return (release = {
        title: release.title,
        id: release.id,
        'first-released': release['first-release-date']
        // type: release['primary-type']
      });
    });
};
