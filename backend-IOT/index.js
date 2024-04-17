const express = require('express');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/data');
const configRoutes = require('./routes/configuration');
const createRoomRoutes = require('./routes/room');
const stateRoutes = require('./routes/state');
const updateState = require('./updateState');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Routes
app.use('/data', dataRoutes);
app.use('/configuration', configRoutes);
app.use('/rooms', createRoomRoutes);
app.use('/state', stateRoutes);

// Appel de la fonction pour mettre à jour l'état des pièces
updateState();

app.listen(port, () => {
    console.log(`Serveur en cours d'écoute sur le port ${port}`);
});
