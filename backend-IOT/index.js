const express = require('express');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/data');
const configRoutes = require('./routes/configuration');
const creatRoomRoutes = require('./routes/createRoom');
const stateRoutes = require('./routes/state');

// Create the express app
const app = express();
const port = 3001;

app.use(bodyParser.json());


// Routes
app.use('/data', dataRoutes);
app.use('/configuration', configRoutes);
app.use('/creatRoom', creatRoomRoutes);
app.use('/state', stateRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});