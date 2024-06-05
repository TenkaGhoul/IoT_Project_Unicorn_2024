const fs = require('fs');

// Function to load room configuration from config.json file
function loadRoomConfig() {
    try {
        const configFilePath = './data/config.json';
        const data = fs.readFileSync(configFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('[Error] loading room configuration:', error.toString());
        return {};
    }
}

// Function to find the room name based on the given ID
function findRoomNameById(id) {
    try {
        // Load room configurations from config.json
        const roomConfig = loadRoomConfig();

        // Iterate through each room in the configurations
        for (const room in roomConfig) {
            // Check if the ID matches the ID of the current room
            if (roomConfig[room].id === id) {
                // If a match is found, return the room name
                return room;
            }
        }

        // If no match is found, return "none"
        return "none";
    } catch (error) {
        console.error('[Error] finding room name by ID:', error.toString());
        return "error";
    }
}

module.exports = {
    findRoomNameById,
    loadRoomConfig
};
