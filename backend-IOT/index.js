const express = require('express');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/data');
const configRoutes = require('./routes/configuration');
const creatRoomRoutes = require('./routes/createRoom');
const stateRoutes = require('./routes/state');

const app = express();
const port = 3000;

app.use(bodyParser.json());


app.use('/data', dataRoutes);
app.use('/configuration', configRoutes);
app.use('/creatRoom', creatRoomRoutes);
app.use('/state', stateRoutes);


app.listen(port, () => {
    console.log(`Serveur en cours d'écoute sur le port ${port}`);
});
