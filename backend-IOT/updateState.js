const cron = require('node-cron');
const fs = require('fs');

let isUpdating = false;
const configFilePath = './data/config.json';
function updateState() {
    // Check if the cron task is already running
    if (isUpdating) {
        console.log("\x1b[33m%s\x1b[0m",'Updating room states is already in progress...');
        return;
    }

    // Mark the cron task as running
    isUpdating = true;

    cron.schedule('*/1 * * * *', () => {
        console.log("\x1b[31m%s\x1b[0m",'Updating room states...');

        // Load configuration data from config.json file

        const configData = loadConfiguration(configFilePath);

        if (!configData) {
            console.error('Unable to load room configuration');
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
                    console.error('Unable to load light data');
                    // Reset the variable to allow a new update attempt
                    isUpdating = false;
                    return;
                }

                // Calculate median light of last 10 data points
                const medianLight = calculateAverageLight(data, room);

                if (medianLight === null) {
                    console.error('Unable to calculate median light');
                    // Reset the variable to allow a new update attempt
                    isUpdating = false;
                    return;
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
        console.error('Error loading configuration:', error.toString());
        return null;
    }
}

function loadData(dataFilePath) {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading data:', error.toString());
        return null;
    }
}

function calculateAverageLight(data, roomId) {
    // Filtrer les données pour la pièce spécifiée
    const roomData = data.filter(entry => entry.id === roomId);

    if (roomData.length < 10) {
        console.error('Il n\'y a pas assez de données pour calculer la moyenne pour la pièce', roomId);
        return null;
    }

    const lastTenLightValues = roomData.slice(-10);
    console.log(lastTenLightValues)
    const sum = lastTenLightValues.reduce((acc, curr) => acc + curr.illuminance, 0);
    const average = sum / lastTenLightValues.length;
    console.log("\x1b[33m%s\x1b[0m", average)
    return average;
}


function updateBlindsState(room, blindOpeningPercentage, configData) {
    // Vérifie si le pourcentage d'ouverture des stores est valide
    if (!isNaN(blindOpeningPercentage) && blindOpeningPercentage >= 0 && blindOpeningPercentage <= 100) {
        // Met à jour les données pour la pièce spécifique
        configData[room].blinds = blindOpeningPercentage;

        console.log('Données mises à jour pour la pièce', room, ':', configData);

        // Write updated data to config.json file
        try {
            fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2));
            console.log('Blinds state updated successfully for room:', room);
        } catch (error) {
            console.error('Error updating blinds state:', error.toString());
        }
    } else {
        console.error('Invalid blind opening percentage:', blindOpeningPercentage);
    }
}

module.exports = updateState;
