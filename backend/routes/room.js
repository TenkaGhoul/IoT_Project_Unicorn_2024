const { log } = require('console');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { config } = require('process');

// Path to the configuration file
const configFilePath = './data/config.json';

// Function to load the configuration from the config.json file
function loadConfiguration() {
  try {
      const data = fs.readFileSync(configFilePath, 'utf8');
      console.log(data);
      return JSON.parse(data)
  } catch (error) {
      console.error('[Error] loading configuration:', error.toString());
      return [];
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

// Route to create a new room
router.post('/:room', (req, res) => {
  try {
    const room = req.params.room;
    console.log(`Creation of a new room: ${room}`);

    let currentConfiguration = loadConfiguration();

    if (currentConfiguration[room]) {
      return res.status(400).json({ message: `The room ${room} already exists` });
    }

    const existedRooms = Object.keys(currentConfiguration);
    const newRoom = {
      id: existedRooms.length + 1,
      id_sensor : 0,
      name: room,
      luminositeMax: 100,
      luminositeMin: 0,
      automatique: true,
      blinds: 0 
    };

    currentConfiguration[room] = newRoom;
    saveConfiguration(currentConfiguration); // Save the updated configuration

    console.log(`New room ${room} created successfully`);
    res.status(201).json({ message: `New room ${room} created successfully` });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room', error: error.toString() });
  }
});

// Route to modify the blinds percentage of a room
// async function modifyBlinds(room, newBlinds) {
//  const data = await PUTRoutines("rooms/" + room + "/blinds", newBlinds);
//  return data;
//}
router.post('/:room/blinds', (req, res) => {
    const room = req.params.room;
    const blinds = req.body.blinds;

    // Check if the blinds percentage is a valid number between 0 and 100
    if (typeof blinds !== 'number' || blinds < 0 || blinds > 100) {
        return res.status(400).json({ error: 'Invalid blinds percentage, must be a number between 0 and 100' });
    }

    // Load the current configuration from the config.json file
    let configData = loadConfiguration();

    if (!configData) {
        // Impossible to load the current configuration, stop the process
        return res.status(500).json({ error: 'Impossible to load the current configuration' });
    }

    // Check if the room exists in the configuration
    if (!configData[room]) {
        return res.status(404).json({ error: `The room ${room} does not exist in the configuration` });
    }

    // Modify the blinds percentage of the room
    configData[room].blinds = blinds;

    // Save the new configuration to the config.json file
    saveConfiguration(configData);

    // Send a response indicating that the blinds percentage has been successfully updated
    res.status(200).json({ message: `Blinds percentage of room ${room} updated successfully` });
});

// Route to modify the configuration of a room (without modifying the blinds and the name)
// http://localhost:3001/rooms/xxx
router.put('/:room', (req, res) => {
    const roomName = req.params.room;
    const newConfig = req.body;

    let configData = loadConfiguration();

    const roomIndex = Object.keys(configData).find(room => configData[room].name === roomName);

    if (roomIndex === -1) {
        return res.status(404).send(`[Error] The room ${roomName} does not exist in the configuration`);
    }

    // Update the configuration of the room
    configData[roomIndex] = {
        ...configData[roomIndex],
        ...newConfig,
        blinds: configData[roomIndex].blinds, // Keep the current blinds value
        name: configData[roomIndex].name // Keep the current name value
    };

    saveConfiguration(configData);

    // Send a response indicating that the configuration has been successfully updated
    res.status(200).send(`[Info] Configuration of room ${roomName} updated successfully`);
});

// Route to modify the name of a room
router.put('/:roomId/:name/:luminositeMin/:luminositeMax', (req, res) => {
  const roomId = req.params.roomId;
  const newName = req.params.name;
  const newLuminositeMin = req.params.luminositeMin;
  const newLuminositeMax = req.params.luminositeMax;

  let configData = loadConfiguration();

  const roomIndex = Object.keys(configData).find(room => configData[room].id === Number(roomId));

  if (!roomIndex) {
    return res.status(404).json({ message: 'Room not found' });
  }

  // Update the name of the room
  configData[roomIndex] = {
    ...configData[roomIndex],
    name: newName || configData[roomIndex].name,
    luminositeMin: newLuminositeMin || configData[roomIndex].luminositeMin,
    luminositeMax: newLuminositeMax || configData[roomIndex].luminositeMax
  };

  // Save the updated configuration
  saveConfiguration(configData);
  res.status(200).send(`[Info] Name of room with id ${roomId} updated successfully to ${newName} and luminositeMin to ${newLuminositeMin} and luminositeMax to ${newLuminositeMax}`);
});

// Route to delete a room from the configuration
router.delete('/:room', (req, res) => {
  try {
    const roomId = req.params.room;

    let configData = loadConfiguration();

    const roomIndex = Object.keys(configData).find(room => configData[room].id === Number(roomId));

    if (!roomIndex) {
      return res.status(404).json({ message: 'Room not found' });
    }

    delete configData[roomIndex];
    saveConfiguration(configData);
    console.log(`Room with id ${roomId} deleted successfully`);
    res.status(200).json({ message: `Room with id ${roomId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room', error: error.toString() });
  }
});


router.put('/:room/luminosity', (req, res) => {
    const room = req.params.room;
    const { minLuminosity, maxLuminosity } = req.body;

    // Vérifier si la luminosité minimale et maximale sont des nombres valides
    if (typeof minLuminosity !== 'number' || typeof maxLuminosity !== 'number') {
        return res.status(400).send('[Error] Invalid luminosity values, must be numbers');
    }

    // Charger le fichier de configuration JSON
    let configData = loadConfiguration();

    // Vérifier si la configuration a été chargée avec succès
    if (!configData) {
        // Impossible de charger la configuration, arrêter le processus
        return res.status(500).send('[Error] Impossible to load the current configuration');
    }

    // Vérifier si la salle existe dans la configuration
    if (!configData[room]) {
        return res.status(404).send(`[Error] The room ${room} does not exist in the configuration`);
    }

    // Modifier les valeurs de luminosité pour la salle spécifiée
    configData[room].luminositeMin = minLuminosity;
    configData[room].luminositeMax = maxLuminosity;

    // Enregistrer les modifications dans le fichier JSON
    saveConfiguration(configData);

    // Réponse de succès
    res.status(200).send(`[Info] Luminosity for room ${room} changed successfully`);
});

// Route to load all the rooms configuration
router.get('/', (req, res) => {
    const configData = loadConfiguration();

    if (!configData) {
      // Impossible to load the current configuration, stop the process
      return res.status(500).send('Impossible to load the current configuration');
    }

    // Send the configuration data as a response
    res.status(200).json(configData);
});

module.exports = router;