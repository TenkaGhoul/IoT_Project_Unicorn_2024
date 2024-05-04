const { log } = require('console');
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
  try {
    const room = req.params.room;
    console.log(`Creation of a new room: ${room}`);

    let currentConfiguration = loadConfiguration() || {};

    if (room in currentConfiguration) {
      return res.status(400).json({ message: `The room ${room} already exists` });
    }

    currentConfiguration[room] = {
      id: room.length + 1,
      name: room,
      luminositeMax: 100,
      luminositeMin: 0,
      automatique: true,
      blinds: 0 
    };

    saveConfiguration(currentConfiguration);
    console.log(`New room ${room} created successfully`);
    res.status(201).json({ message: `New room ${room} created successfully` });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room' });
  }
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

// Route to delete a room from the configuration
// http://localhost:3001/rooms/xxx
router.delete('/:room', (req, res) => {
  try {
    const roomId = req.params.room;

    let configData = loadConfiguration();

    if (!configData) {
      return res.status(500).json({ message: 'Impossible to load the current configuration' });
    }

    // Find the room corresponding to the specified ID
    const roomToDelete = Object.keys(configData).find(room => configData[room].id === Number(roomId));

    if (!roomToDelete) {
      return res.status(404).json({ message: 'Room not found' });
    }

    delete configData[roomToDelete];
    saveConfiguration(configData);
    console.log(`Room ${roomToDelete} deleted successfully`);
    res.status(200).json({ message: `Room ${roomToDelete} deleted successfully` });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room' });
  }
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
