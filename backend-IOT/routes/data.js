const express = require('express');
const router = express.Router();
const fs = require('fs');

// Path to the data file
const dataFilePath = './data/data.json';

// Route to receive data from the Hardwario card
router.post('/', (req, res) => {
    const data = req.body;
    console.log('Received data:', data);

    // Add the timestamp of data reception
    data.timestamp = new Date();

    // Save the data to the data.json file
    saveData(data);

    res.status(200).send('Data received successfully');
});

// Function to save data to the data.json file
function saveData(data) {
    try {
        // Load the current data from the data.json file
        let currentData = loadCurrentData();

        // Add the new data to the array
        currentData.push(data);

        // Write the updated data to the data.json file
        fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));
        console.log('Data saved successfully to data.json');
    } catch (error) {
        console.error('Error saving data to data.json:', error.toString());
    }
}

// Function to load current data from the data.json file
function loadCurrentData() {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or is empty, return an empty array
        return [];
    }
}

module.exports = router;
