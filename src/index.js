const port = process.env.PORT || 3000; //  Configures the application PORT to either the current enviorments port OR if enviorment port is not set, port '3000'
const express = require('express');
const routeArtist = require('./routes/artist');
const routeDefault = require('./routes/default');
const app = express();

//  Root Route
app.use('/', routeDefault);

//  Artist by mbid
app.use('/api/artist', routeArtist);

app.listen(port, () => console.log(`Listening on port ${port}...`));
