// Importation des modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialisation du serveur Express
const app = express();
const port = 3000;

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Route pour recevoir les données de la carte Hardwario
app.post('/data', (req, res) => {
    const data = req.body;
    console.log('Données reçues :', data);
    // Ajoutez ici le code pour traiter les données comme vous le souhaitez
    res.status(200).send('Données reçues avec succès');
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'écoute sur le port ${port}`);
});
