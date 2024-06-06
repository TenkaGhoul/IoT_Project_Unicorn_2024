var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
const fs = require('fs');

var connectionString = 'HostName=SmartShade.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=DNGPkw0hDODhN+uVEPH3bu9dFA/wVavYSAIoTEx6pD0=';
var targetDevice = 'SmartShade';

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

function receiveFeedback(err, receiver){
    receiver.on('message', function (msg) {
        console.log('Feedback message:')
        console.log(msg.getData().toString('utf-8'));
    });
}
/*
function sendMessageToAzure(room, blinds) {
    // Créer un message avec les données à envoyer à Azure IoT Hub
    var message = new Message(JSON.stringify({ room: room, blinds: blinds }));

    // Envoyer le message au périphérique cible sur Azure IoT Hub
    serviceClient.send(targetDevice, message, printResultFor('send'));
}
*/
function sendMessageToAzure() {
    const configFilePath = './data/config.json';

    try {
        // Lire le contenu du fichier config.json
        const configData = fs.readFileSync(configFilePath);

        // Créer un message avec les données à envoyer à Azure IoT Hub
        var message = new Message(configData);

        // Envoyer le message au périphérique cible sur Azure IoT Hub
        serviceClient.send(targetDevice, message, printResultFor('send'));

        console.log('[Info] Configuration data sent to Azure IoT Hub successfully.');
    } catch (error) {
        console.error('[Error] Unable to send configuration data to Azure IoT Hub:', error.toString());
    }
}

// Exporter la fonction sendMessageToAzure pour qu'elle soit accessible depuis d'autres modules
module.exports = {
    sendMessageToAzure: sendMessageToAzure
};