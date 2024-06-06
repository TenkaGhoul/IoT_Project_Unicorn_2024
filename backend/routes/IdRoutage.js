const express = require('express');
const router = express.Router();
const fs = require('fs');
const { findRoomNameById, loadRoomConfig } = require('../utils');

// Path to the ID list file
const idListFilePath = './data/idList.json';

// Route to modify the ID of a room
router.post('/modify-id', (req, res) => {
    const { room, newId } = req.body;

    try {
        // Load room configurations from config.json
        const roomConfig = loadRoomConfig();

        // Check if the new ID is already assigned to another room
        const existingRoom = findRoomNameById(newId);
        if (existingRoom !== "none") {
            // If the new ID is already assigned, update the existing room's ID to 0
            roomConfig[existingRoom].id_sensor = 0;
        }

        // Update the ID of the specified room
        roomConfig[room].id_sensor = newId;

        // Write the updated room configurations back to config.json
        const configFilePath = './data/config.json';
        fs.writeFileSync(configFilePath, JSON.stringify(roomConfig, null, 2));

        res.status(200).send('Room ID modified successfully');
    } catch (error) {
        console.error('Error modifying room ID:', error.toString());
        res.status(500).send('Error modifying room ID');
    }
});

// Route to get the list of IDs from idList.json
router.get('/get-idList', (req, res) => {
    try {
        // Load the list of IDs from idList.json file
        const idList = loadIdList();
        res.status(200).json(idList);
    } catch (error) {
        console.error('Error loading ID list:', error.toString());
        res.status(500).send('Error loading ID list');
    }
});

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

module.exports = router;
