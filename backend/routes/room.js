const express = require('express');
const router = express.Router();
const fs = require('fs');

// Chemin du fichier de configuration
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

// Route pour créer une nouvelle pièce avec une configuration de base
router.post('/:room', (req, res) => {
    const room = req.params.room;
    console.log(`Création d'une nouvelle pièce : ${room}`);

    // Charger la configuration actuelle ou créer un objet vide si le fichier n'existe pas
    let currentConfiguration = loadConfiguration() || {};

    // Vérifier si la pièce existe déjà dans la configuration
    if (room in currentConfiguration) {
        return res.status(400).send(`La pièce ${room} existe déjà`);
    }

    // Créer une nouvelle configuration de base pour la pièce
    currentConfiguration[room] = {
        id: 0,
        luminositeMax: 100,
        luminositeMin: 0,
        automatique: true,
        blinds: 0 // Ajouter la propriété des stores avec une valeur par défaut
    };

    // Enregistrer la nouvelle configuration dans le fichier config.json
    saveConfiguration(currentConfiguration);

    // Envoyer une réponse indiquant que la pièce a été créée avec succès
    res.status(201).send(`Nouvelle pièce ${room} créée avec succès`);
});

// Route pour modifier le pourcentage d'ouverture des stores d'une pièce existante
router.post('/:room/blinds', (req, res) => {
    const room = req.params.room;
    const { blinds } = req.body;

    // Vérifier si le pourcentage d'ouverture est valide (entre 0 et 100)
    if (typeof blinds !== 'number' || blinds < 0 || blinds > 100) {
        return res.status(400).send('Le pourcentage d\'ouverture doit être compris entre 0 et 100');
    }

    // Charger la configuration actuelle depuis le fichier config.json
    let configData = loadConfiguration();

    if (!configData) {
        // Impossible de charger la configuration actuelle, arrêter le traitement
        return res.status(500).send('Impossible de charger la configuration actuelle');
    }

    // Vérifier si la pièce existe déjà dans la configuration
    if (!configData[room]) {
        return res.status(404).send(`La pièce ${room} n'existe pas dans la configuration`);
    }

    // Modifier le pourcentage d'ouverture des stores de la pièce
    configData[room].blinds = blinds;

    // Enregistrer la nouvelle configuration dans le fichier config.json
    saveConfiguration(configData);

    // Envoyer une réponse indiquant que la configuration a été mise à jour avec succès
    res.status(200).send(`Pourcentage d'ouverture des stores de la pièce ${room} mis à jour avec succès`);
});

// Route pour modifier la configuration d'une pièce existante (sans les stores)
router.put('/:room', (req, res) => {
    const room = req.params.room;
    const newConfig = req.body;

    // Charger la configuration actuelle depuis le fichier config.json
    let configData = loadConfiguration();

    if (!configData) {
        // Impossible de charger la configuration actuelle, arrêter le traitement
        return res.status(500).send('Impossible de charger la configuration actuelle');
    }

    // Vérifier si la pièce existe déjà dans la configuration
    if (!configData[room]) {
        return res.status(404).send(`La pièce ${room} n'existe pas dans la configuration`);
    }

    // Mettre à jour la configuration de la pièce (sans modifier les stores)
    configData[room] = {
        ...configData[room],
        ...newConfig,
        blinds: configData[room].blinds // Conserver la valeur des stores
    };

    // Enregistrer la nouvelle configuration dans le fichier config.json
    saveConfiguration(configData);

    // Envoyer une réponse indiquant que la configuration a été mise à jour avec succès
    res.status(200).send(`Configuration de la pièce ${room} mise à jour avec succès`);
});

// Route pour supprimer une pièce de la configuration
router.delete('/:room', (req, res) => {
    const room = req.params.room;
    console.log(`Suppression de la pièce : ${room}`);

    // Charger la configuration actuelle depuis le fichier config.json
    let configData = loadConfiguration();

    if (!configData) {
        // Impossible de charger la configuration actuelle, arrêter le traitement
        return res.status(500).send('Impossible de charger la configuration actuelle');
    }

    // Vérifier si la pièce existe déjà dans la configuration
    if (!configData[room]) {
        return res.status(404).send(`La pièce ${room} n'existe pas dans la configuration`);
    }

    // Supprimer la pièce de la configuration
    delete configData[room];

    // Enregistrer la nouvelle configuration dans le fichier config.json
    saveConfiguration(configData);

    // Envoyer une réponse indiquant que la pièce a été supprimée avec succès
    res.status(200).send(`Pièce ${room} supprimée avec succès`);
});

// Route pour charger toute la configuration
router.get('/', (req, res) => {
    const configData = loadConfiguration();

    if (!configData) {
        // Impossible de charger la configuration actuelle, arrêter le traitement
        return res.status(500).send('Impossible de charger la configuration actuelle');
    }

    // Envoyer la configuration chargée
    res.status(200).json(configData);
});

module.exports = router;
