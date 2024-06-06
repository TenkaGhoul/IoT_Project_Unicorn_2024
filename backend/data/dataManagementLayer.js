const cron = require('node-cron');
const fs = require('fs');
const azureManagementLayer = require('./azureManagementLayer');

let isUpdating = false;
const configFilePath = './data/config.json';

function updateState() {
    // Check if the cron task is already running
    if (isUpdating) {
        console.log("\x1b[33m%s\x1b[0m",'[Info] Update already in progress...');
        return;
    }

    // Mark the cron task as running
    isUpdating = true;

    cron.schedule('*/1 * * * *', () => {
        console.log("\x1b[33m%s\x1b[0m",'[Info] Updating room states...');

        // Load configuration data from config.json file
        const configData = loadConfiguration(configFilePath);

        if (!configData) {
            console.error('[Error] Unable to load configuration data');
            // Reset the variable to allow a new update attempt
            isUpdating = false;
            return;
        }

        // Iterate over each room in the configuration
        for (const room in configData) {
            const roomConfig = configData[room];

            // Check if the room is in automatic mode
            if (roomConfig.automatique) {
                // Load light data from data.json file
                const dataFilePath = './data/data.json';
                const data = loadData(dataFilePath);

                if (!data) {
                    console.error('[Error] Unable to load data');
                    continue; // Continue to the next room
                }

                // Calculate median light of last 10 data points
                const medianLight = calculateAverageLight(data, room);

                if (medianLight === null) {
                    console.error('[Error] Unable to calculate median light for room:', room);
                    continue; // Continue to the next room
                }

                // Calculate blind opening percentage based on median light
                let blindOpeningPercentage = 0;

                if (medianLight <= roomConfig.luminositeMin) {
                    blindOpeningPercentage = 100;
                } else if (medianLight >= roomConfig.luminositeMax) {
                    blindOpeningPercentage = 0;
                } else {
                    blindOpeningPercentage = ((roomConfig.luminositeMax - medianLight) / (roomConfig.luminositeMax - roomConfig.luminositeMin)) * 100;
                }

                // Update blinds state for the specific room
                updateBlindsState(room, blindOpeningPercentage, configData);
            }
        }

        // Reset the variable to allow a new update attempt
        isUpdating = false;
    });
}

function loadConfiguration(configFilePath) {
    try {
        const data = fs.readFileSync(configFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('[Error] loading configuration:', error.toString());
        return null;
    }
}

function loadData(dataFilePath) {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('[Error] loading data:', error.toString());
        return null;
    }
}

function calculateAverageLight(data, roomId) {
    // Filter data points for the specific room and within the last 2 minutes
    const roomData = data.filter(entry => entry.id === roomId && (Date.now() - new Date(entry.timestamp).getTime()) < 120000);

    if (roomData.length < 10) {
        console.error('[Error] Not enough data points for room:', roomId);
        return null;
    }

    const lastTenLightValues = roomData.slice(-10);
    console.log(lastTenLightValues)
    const sum = lastTenLightValues.reduce((acc, curr) => acc + curr.illuminance, 0);
    const average = sum / lastTenLightValues.length;
    console.log("\x1b[33m%s\x1b[0m",'[Info] Calculated average light for room:', roomId, ":", average);
    return average;
}


function updateBlindsState(room, blindOpeningPercentage, configData) {
    // Check if the blind opening percentage is valid
    if (!isNaN(blindOpeningPercentage) && blindOpeningPercentage >= 0 && blindOpeningPercentage <= 100) {
        // Update the blinds state for the specific room
        configData[room].blinds = blindOpeningPercentage;

        console.log('[Info] Updating blinds state for room:', room, 'to', blindOpeningPercentage);

        // Write the updated configuration to the config.json file
        try {
            fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2));
            console.log('[Info] Blinds state updated successfully for room:', room);

            // Send message to Azure IoT Hub
            //azureManagementLayer.sendMessageToAzure(room, blindOpeningPercentage);
            azureManagementLayer.sendMessageToAzure();
        } catch (error) {
            console.error('[Error] Updating blinds state:', error.toString());
        }
    } else {
        console.error('[Error] Invalid blind opening percentage : ', blindOpeningPercentage);
    }
}

module.exports = updateState;