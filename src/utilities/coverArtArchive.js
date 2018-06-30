const axios = require('axios');

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

module.exports = { fetchCoverArt };
