const express = require('express');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/data');
const configRoutes = require('./routes/configuration');
const createRoomRoutes = require('./routes/room');
const IdRoutes = require('./routes/IdRoutage')
const updateState = require('./data/dataManagementLayer');

// Create the express app
const app = express();
const port = 3001;

// Middleware to parse the body of the request
app.use(bodyParser.json());

// Routes
app.use('/data', dataRoutes);
app.use('/configuration', configRoutes);
app.use('/rooms', createRoomRoutes);
app.use('/ID', IdRoutes)

// Update the state of the rooms
updateState();

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});