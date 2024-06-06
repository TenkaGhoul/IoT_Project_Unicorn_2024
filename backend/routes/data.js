const express = require('express');
const router = express.Router();
const fs = require('fs');
const Utils = require('../utils');

// Path to the data file
const dataFilePath = './data/data.json';
const idListFilePath = './data/idList.json'; // Path to the ID list file

// Route to receive data from the Hardwario card
router.post('/', (req, res) => {
    const data = req.body;
    console.log('Received data:', data);

    // Add the timestamp of data reception
    data.timestamp = new Date();

    // Add the original ID to the ID list
    addToIdList(data.id);
    // Save the data to the data.json file
    saveData(data);

    res.status(200).send('Data received successfully');
});

// Route to load data from data.json
router.get('/', (req, res) => {
    try {
        // Load data from the data.json file
        const data = loadCurrentData();
        res.status(200).json(data);
    } catch (error) {
        console.error('[Error] loading data from data.json:', error.toString());
        res.status(500).send('Error loading data from data.json');
    }
});

// Function to save data to the data.json file
function saveData(data) {
    try {
        // Load the current data from the data.json file
        let currentData = loadCurrentData();

        // Load the mapping of room names to IDs from the config file
        const roomConfig = Utils.loadRoomConfig();

        // Retrieve the room name corresponding to the ID
        const room = Utils.findRoomNameById(data.id);

        // Check if the room name exists in the config file
        if (!roomConfig[room]) {
            console.error('[Error] Room name not found in the configuration:', room);
            return;
        }

        // Assign the retrieved room name as the ID
        data.id = room;

        // Add the new data to the array
        currentData.push(data);

        // Write the updated data to the data.json file
        fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));
        console.log(' [Info] Data saved successfully:', data);
    } catch (error) {
        console.error('[Error] saving data to data.json:', error.toString());
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

// Function to load the list of IDs from idList.json file
function loadIdList() {
    try {
        const data = fs.readFileSync(idListFilePath);
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or is empty, return an empty array
        return [];
    }
}

// Function to add the original ID to the ID list
function addToIdList(id) {
    try {
        let idList = loadIdList();
        if (!idList.includes(id)) {
            idList.push(id);
            fs.writeFileSync(idListFilePath, JSON.stringify(idList, null, 2));
            console.log(' [Info] ID added to the ID list:', id);
        }
    } catch (error) {
        console.error('[Error] adding ID to the ID list:', error.toString());
    }
}

module.exports = router;