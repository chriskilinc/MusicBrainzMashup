const axios = require('axios');

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

module.exports = { fetchDescFromWikipedia };
