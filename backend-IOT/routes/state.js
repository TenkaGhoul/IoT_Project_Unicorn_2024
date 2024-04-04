const express = require('express');
const router = express.Router();
const fs = require('fs');

// Chemin du fichier d'état des stores
const blindsStateFilePath = './data/state.json';

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

// Route pour modifier le state d'une pièce
router.post('/:room', (req, res) => {
    const room = req.params.room;
    const { state } = req.body;

    // Vérifier si le pourcentage d'ouverture est valide (entre 0 et 100)
    if (typeof state !== 'number' || state < 0 || state > 100) {
        return res.status(400).send('Le pourcentage d\'ouverture doit être compris entre 0 et 100');
    }

    // Charger le state actuel depuis le fichier state.json
    let currentState = loadBlindsState();

    if (!currentState) {
        // Impossible de charger le state actuel, arrêter le traitement
        return res.status(500).send('Impossible de charger le state actuel');
    }

    // Vérifier si la pièce existe déjà dans le state
    if (!currentState[room]) {
        return res.status(404).send(`La pièce ${room} n'existe pas dans le state`);
    }

    // Modifier le pourcentage d'ouverture du store de la pièce
    currentState[room].blinds = state;

    // Enregistrer le nouveau state dans le fichier state.json
    saveBlindsState(currentState);

    // Envoyer une réponse indiquant que le state a été mis à jour avec succès
    res.status(200).send(`State de la pièce ${room} mis à jour avec succès`);
});

module.exports = router;
