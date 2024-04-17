const express = require('express');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/data');
const configRoutes = require('./routes/configuration');
const createRoomRoutes = require('./routes/room');
const updateState = require('./updateState');

// Create the express app
const app = express();
const port = 3001;

// Middleware to parse the body of the request
app.use(bodyParser.json());

// Routes
app.use('/data', dataRoutes);
app.use('/configuration', configRoutes);
app.use('/rooms', createRoomRoutes);

// Appel de la fonction pour mettre à jour l'état des pièces
updateState();

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});