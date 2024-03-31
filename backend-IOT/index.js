const express = require('express');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/data');
const configRoutes = require('./routes/configuration');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Routes pour les données
app.use('/data', dataRoutes);

// Routes pour la configuration
app.use('/configuration', configRoutes);

app.listen(port, () => {
    console.log(`Serveur en cours d'écoute sur le port ${port}`);
});
