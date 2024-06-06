const express = require('express');
const router = express.Router();
const fs = require('fs');

// Path: backend-IOT/routes/configuration.js 
const configFilePath = './data/config.json';

// Route to modify the configuration of an existing room
router.post('/:room', (req, res) => {
    const room = req.params.room;
    const newConfiguration = req.body;
    console.log(`[Info] Updating configuration for room ${room}:`, newConfiguration);

    let currentConfiguration = loadConfiguration();

    if (!currentConfiguration) {
        return res.status(500).send('Unable to load the current configuration');
    }
    if (!(room in currentConfiguration)) {
        return res.status(404).send(`The room ${room} does not exist`);
    }

    // Merge the new configuration with the current configuration of the room
    Object.assign(currentConfiguration[room], newConfiguration);

    saveConfiguration(currentConfiguration);
    res.status(200).send(`Configuration for room ${room} successfully updated`);
});

// Function to load the configuration from the config.json file
function loadConfiguration() {
    try {
        const data = fs.readFileSync(configFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('[Error] loading configuration:', error.toString());
        return null;
    }
}

// Function to write the configuration to the config.json file
function saveConfiguration(configuration) {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(configuration, null, 2));
        console.log('[Info] Configuration updated successfully');
    } catch (error) {
        console.error('[Error] saving configuration:', error.toString());
    }
}

module.exports = router;