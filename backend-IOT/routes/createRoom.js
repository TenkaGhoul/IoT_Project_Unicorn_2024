const express = require('express');
const router = express.Router();
const fs = require('fs');

// Chemin du fichier de configuration
const configFilePath = './data/config.json';
const blindsStateFilePath = './data/state.json';

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

// Fonction pour initialiser l'état des stores dans une pièce
function initializeBlindsState(room) {
    const blindsState = {};
    // Initialiser l'état de chaque store dans la pièce avec un pourcentage d'ouverture par défaut
    // Vous pouvez ajuster cette valeur selon vos besoins
    /*
    for (let i = 1; i <= 4; i++) {
        blindsState[`blind${i}`] = 0; // Par défaut, tous les stores sont fermés (0% d'ouverture)
    }
    */
    blindsState[`blinds`] = 0;
    return blindsState;
}

// Fonction pour charger l'état des stores depuis le fichier state.json
function loadBlindsState() {
    try {
        const data = fs.readFileSync(blindsStateFilePath);
        console.log('État des stores chargé avec succès :', data.toString());
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors du chargement de l\'état des stores :', error.toString());
        return null;
    }
}

// Fonction pour écrire l'état des stores dans le fichier state.json
function saveBlindsState(blindsState) {
    try {
        fs.writeFileSync(blindsStateFilePath, JSON.stringify(blindsState, null, 2));
        console.log('État des stores mis à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'état des stores :', error.toString());
    }
}

// Route pour créer une nouvelle pièce avec une configuration de base
router.post('/:room', (req, res) => {
    const room = req.params.room;
    console.log(`Création d'une nouvelle pièce : ${room}`);

    // Charger la configuration actuelle ou créer un objet vide si le fichier n'existe pas
    let currentConfiguration = loadConfiguration() || {};
    let currentBlindsState = loadBlindsState() || {}; // Charger l'état actuel des stores

    // Vérifier si la pièce existe déjà dans la configuration
    if (room in currentConfiguration) {
        return res.status(400).send(`La pièce ${room} existe déjà`);
    }

    // Créer une nouvelle configuration de base pour la pièce
    currentConfiguration[room] = {
        luminositeMax: 100,
        luminositeMin: 0,
        automatique: true
    };

    // Créer l'état initial des stores pour la nouvelle pièce
    currentBlindsState[room] = initializeBlindsState(room);

    // Enregistrer la nouvelle configuration dans le fichier config.json
    saveConfiguration(currentConfiguration);
    saveBlindsState(currentBlindsState); // Enregistrer l'état des stores

    // Envoyer une réponse indiquant que la pièce a été créée avec succès
    res.status(201).send(`Nouvelle pièce ${room} créée avec succès`);
});


module.exports = router;
