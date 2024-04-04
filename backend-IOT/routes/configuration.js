const express = require('express');
const router = express.Router();
const fs = require('fs');

// Chemin du fichier de configuration
const configFilePath = './data/config.json';

// Route pour modifier la configuration d'une pièce existante
router.post('/:room', (req, res) => {
    const room = req.params.room;
    const newConfiguration = req.body;
    console.log(`Modification de la configuration de la pièce ${room} :`, newConfiguration);

    // Charger la configuration actuelle
    let currentConfiguration = loadConfiguration();

    if (!currentConfiguration) {
        // Impossible de charger la configuration actuelle, arrêter le traitement
        return res.status(500).send('Impossible de charger la configuration actuelle');
    }

    // Vérifier si la pièce existe dans la configuration actuelle
    if (!(room in currentConfiguration)) {
        // Si la pièce n'existe pas, renvoyer une erreur
        return res.status(404).send(`La pièce ${room} n'existe pas`);
    }

    // Fusionner la nouvelle configuration avec la configuration actuelle de la pièce
    Object.assign(currentConfiguration[room], newConfiguration);

    // Enregistrer la nouvelle configuration dans le fichier config.json
    saveConfiguration(currentConfiguration);

    // Envoyer une réponse indiquant que la configuration a été mise à jour avec succès
    res.status(200).send(`Configuration de la pièce ${room} mise à jour avec succès`);
});

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

module.exports = router;
