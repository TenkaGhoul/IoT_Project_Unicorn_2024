const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post('/data', (req, res) => {
    const data = req.body;
    console.log('Data received:', data);
    res.status(200).send('- Data received with success');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

const fs = require('fs');
const configFilePath = './data/config.json';

// Function to load the configuration from the config.json file
function loadConfiguration() {
    try {
        const data = fs.readFileSync(configFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('[ERROR] Impossible to load configuration:', error.toString());
        return null;
    }
}

// Function to save the configuration in the config.json file
function saveConfiguration(configuration) {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(configuration, null, 2));
        console.log('Configuration updated successfully');
    } catch (error) {
        console.error('[ERROR] Impossible to save configuration:', error.toString());
    }
}

// POST Route to update the configuration of a room
app.post('/configuration', (req, res) => {
    const newConfiguration = req.body;
    console.log('New configuration received:', newConfiguration);

    // load the current configuration from the config.json file
    let currentConfiguration = loadConfiguration();

    if (!currentConfiguration) {
        return res.status(500).send('Impossible to load the current configuration');
    }

    // Merge the new configuration with the current configuration
    Object.assign(currentConfiguration, newConfiguration);

    // Save the updated configuration in the config.json file
    saveConfiguration(currentConfiguration);
    res.status(200).send('Configuration updated with success');
});