const express = require('express');
const router = express.Router();
const fs = require('fs');

// Path: backend-IOT/routes/state.js
const blindsStateFilePath = './data/state.json';

// Function to load the blinds state from the state.json file
function loadBlindsState() {
    try {
        const data = fs.readFileSync(blindsStateFilePath);
        console.log('Blinds state loaded successfully');
        return JSON.parse(data);
    } catch (error) {
        console.error('[ERROR] Impossible to load blinds state:', error.toString());
        return null;
    }
}

// Function to save the blinds state in the state.json file
function saveBlindsState(blindsState) {
    try {
        fs.writeFileSync(blindsStateFilePath, JSON.stringify(blindsState, null, 2));
        console.log('Blinds state updated successfully');
    } catch (error) {
        console.error('[ERROR] Impossible to save blinds state:', error.toString());
    }
}

// POST Route to update the state of a room
// http://localhost:3000/state/living-room
router.post('/:room', async (req, res) => {
    const room = req.params.room;
    const { state } = req.body;

    if (typeof state !== 'number' || state < 0 || state > 100) {
        return res.status(400).send('[Warning] Invalid state value, it should be a number between 0 and 100');
    }

    try {
        let currentState = await loadBlindsState();

        if (!currentState[room]) {
            return res.status(404).send(`The room ${room} does not exist`);
        }

        currentState[room].blinds = state;

        await saveBlindsState(currentState);

        res.status(200).send(`State of the room ${room} updated with success`);
    } catch (error) {
        res.status(500).send('[Error] An error occurred while processing your request');
    }
});

// GET Route to get the state of a room
// http://localhost:3000/state/living-room
router.get('/:room', async (req, res) => {
    const room = req.params.room;

    try {
        let currentState = await loadBlindsState();

        if (!currentState[room]) {
            return res.status(404).send(`The room ${room} does not exist`);
        }

        res.status(200).send(currentState[room]);
    } catch (error) {
        res.status(500).send('[Error] An error occurred while processing your request');
    }
});

// GET Route to get the state of all rooms
// http://localhost:3000/state
router.get('/', async (req, res) => {
    try {
        let currentState = await loadBlindsState();
        res.status(200).send(currentState);
    } catch (error) {
        res.status(500).send('[Error] An error occurred while processing your request');
    }
});

module.exports = router;