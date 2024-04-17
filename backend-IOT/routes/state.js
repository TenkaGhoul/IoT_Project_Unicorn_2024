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
function saveConfiguration(configData) {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2));
        console.log('Configuration mise à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la configuration :', error.toString());
    }
}

// Route pour modifier le state d'une pièce
router.post('/:room', (req, res) => {
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
    res.status(200).send(`Configuration de la pièce ${room} mise à jour avec succès`);
});

module.exports = router;
