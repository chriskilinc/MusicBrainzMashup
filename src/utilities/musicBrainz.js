const axios = require('axios');
function fetchArtistFromMusicBrainz(mbid) {
  const apiUrl = 'http://musicbrainz.org/ws/2/';
  try {
    return axios
      .get(`${apiUrl}artist/${mbid}?inc=release-groups+url-rels&fmt=json`)
      .then(artist => {
        return createArtistObjectFromMusicBrainz(artist);
      });
  } catch (error) {
    throw new Error('Could not Fetch MusicBrainz');
  }
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

module.exports = {
  fetchArtistFromMusicBrainz
};
