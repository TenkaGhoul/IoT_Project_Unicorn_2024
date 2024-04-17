const express = require('express');
const router = express.Router();
const fs = require('fs');

// Path: backend-IOT/routes/createRoom.js
const configFilePath = './data/config.json';
const blindsStateFilePath = './data/state.json';


// Function to load the configuration from the config.json file
function loadConfiguration() {
    try {
        const data = fs.readFileSync(configFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading configuration:', error.toString());
        return null;
    }
}


// Function to write the configuration to the config.json file
function saveConfiguration(configuration) {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(configuration, null, 2));
        console.log('Configuration successfully updated');
    } catch (error) {
        console.error('Error updating configuration:', error.toString());
    }
}

// Function to initialize the blinds state for a room
function initializeBlindsState(room) {
    const blindsState = {};
    blindsState[`blinds`] = 0;
    return blindsState;
}

// Function to load the blinds state from the state.json file
function loadBlindsState() {
    try {
        const data = fs.readFileSync(blindsStateFilePath);
        console.log('Blinds state loaded successfully:', data.toString());
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading blinds state:', error.toString());
        return null;
    }
}

// Function to save the blinds state in the state.json file
function saveBlindsState(blindsState) {
    try {
        fs.writeFileSync(blindsStateFilePath, JSON.stringify(blindsState, null, 2));
        console.log('Blinds state successfully updated');
    } catch (error) {
        console.error('Error updating blinds state:', error.toString());
    }
}

// POST Route to create a new room
// http://localhost:3000/createRoom/living-room
router.post('/:room', (req, res) => {
    const room = req.params.room;
    console.log(`Creating a new room: ${room}`);

    let currentConfiguration = loadConfiguration() || {};
    let currentBlindsState = loadBlindsState() || {};

    if (room in currentConfiguration) {
        return res.status(400).send(`The room ${room} already exists`);
    }

    currentConfiguration[room] = {
        maxBrightness: 100,
        minBrightness: 0,
        automatic: true
    };

    currentBlindsState[room] = initializeBlindsState(room);

    saveConfiguration(currentConfiguration);
    saveBlindsState(currentBlindsState);

    res.status(201).send(`New room ${room} successfully created`);
});

module.exports = router;