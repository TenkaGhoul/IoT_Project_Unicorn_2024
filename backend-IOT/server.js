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

// Chemin du fichier de configuration
const fs = require('fs');

const configFilePath = './data/config.json';

// Fonction pour charger la configuration depuis le fichier config.json
function loadConfiguration() {
    try {
        const data = fs.readFileSync(configFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors du chargement de la configuration :', error.toString());
        return null;
    }
}

// Fonction pour écrire la configuration dans le fichier config.json
function saveConfiguration(configuration) {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(configuration, null, 2));
        console.log('Configuration mise à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la configuration :', error.toString());
    }
}

// Route pour recevoir et modifier la configuration
app.post('/configuration', (req, res) => {
    const newConfiguration = req.body;
    console.log('Nouvelle configuration reçue :', newConfiguration);

    // Charger la configuration actuelle
    let currentConfiguration = loadConfiguration();

    if (!currentConfiguration) {
        // Impossible de charger la configuration actuelle, arrêter le traitement
        return res.status(500).send('Impossible de charger la configuration actuelle');
    }

    // Fusionner la nouvelle configuration avec la configuration actuelle
    Object.assign(currentConfiguration, newConfiguration);

    // Enregistrer la nouvelle configuration dans le fichier config.json
    saveConfiguration(currentConfiguration);

    // Envoyer une réponse indiquant que la configuration a été mise à jour avec succès
    res.status(200).send('Configuration mise à jour avec succès');
});

