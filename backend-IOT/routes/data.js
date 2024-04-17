const express = require('express');
const router = express.Router();

// POST Route to receive data from the Hardwario card
// http://localhost:3000/data
router.post('/', (req, res) => {
    const data = req.body;
    console.log('Data received :', data);
    res.status(200).send('Data received with success');
});

module.exports = router;