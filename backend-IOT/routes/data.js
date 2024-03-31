const express = require('express');
const router = express.Router();

// Route pour recevoir les données de la carte Hardwario
router.post('/', (req, res) => {
    const data = req.body;
    console.log('Données reçues :', data);
    // Ajoutez ici le code pour traiter les données comme vous le souhaitez
    res.status(200).send('Données reçues avec succès');
});

module.exports = router;