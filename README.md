# MusicBrainz Mashup REST API
**Using public api:s from MusicBrainz, Wikipedia and CoverArtArchive**

*Routes*
```
/api/artist/:id
```

### Installation
MusicBrainzMashup was developed to run on at least NodeJs v9.7.1 and has not been tested on other versions.

Production
```sh
$ git clone MusicBrainzMashup
$ cd MusicBrainzMashup
$ yarn  /   npm install
$ yarn start    /   npm start
```

Development
```sh
$ git clone MusicBrainzMashup
$ cd MusicBrainzMashup
$ yarn  / npm install
$ yarn dev  / npm run dev
```

### Stack
* NodeJs
* Express



### Testing
Unit Testing with Jest
```sh
$ yarn test
```