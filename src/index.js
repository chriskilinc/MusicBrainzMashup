const port = process.env.PORT || 3000; //  Configures the application PORT to either the current enviorments port OR if enviorment port is not set, port '3000'
const express = require('express');
const routeApi = require('./routes/api');
const routeDefault = require('./routes/default');
const routeArtist = require('./routes/artist');
const app = express();

//  Root Route
app.use('/', routeDefault);

//  Api Route
app.use('/api', routeApi);

//  Artist Route
app.use('/api/artist', routeArtist);

app.listen(port, () => console.log(`Listening on port ${port}...`));
