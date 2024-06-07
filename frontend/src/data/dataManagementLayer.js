// fetch initial data from the server
const baseUrl = 'http://localhost:3002/';

// fetch (get) data from the server
async function fetchRoutines(url) {
    const urlFull = baseUrl + url;
    console.log("GET Requesting: " + urlFull);
    let result = null;
    try {
        await fetch(urlFull)
            .then((res) => res.json())
            .then((parsedJson) => result = parsedJson);
        console.log("Result fetching = " + JSON.stringify(result));
    } catch (error) {
        console.error('Error fetching data', error);
    }
    return result;
}

// fetch (post) data to the server
async function POSTRoutines(url, data) {
    const urlFull = baseUrl + url;
    console.log("POST Requesting: " + urlFull);
    let result = null;
    await fetch(urlFull,
        {method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((parsedJson) => result = parsedJson);
    console.log("Result fetching = " + JSON.stringify(result));
    return result;
}

// fetch (put) data to the server
async function PUTRoutines(url, data) {
    const urlFull = baseUrl + url;
    console.log("PUT Requesting: " + urlFull);
    let result = null;
    await fetch(urlFull,
        {method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((parsedJson) => result = parsedJson);
    console.log("Result fetching = " + JSON.stringify(result));
    return result;
}

// fetch (delete) data to the server
async function DELETERoutines(url) {
    const urlFull = baseUrl + url;
    console.log("DELETE Requesting: " + urlFull);
    let result = null;
    await fetch(urlFull, {method: "DELETE"})
        .then((res) => res.json())
        .then((parsedJson) => result = parsedJson);
    console.log("Result fetching = " + JSON.stringify(result));
    return result;
}

/////


// fetch all rooms from the server
async function fetchRooms() {
    const data = await fetchRoutines('rooms');
    return data || [];
}

// fetch all data from the server
async function fetchData() {
    const data = await fetchRoutines("data");
    return data;
}

// fetch the ID from the server
async function fetchID() {
    const data = await fetchRoutines("ID/get-idList");
    return data;
}

// create a new room
async function createRoom(room) {
    const data = await POSTRoutines("rooms/"+ room);
    return data;
}

// delete a room
async function deleteRoom(room) {
    const data = await DELETERoutines("rooms/" + room);
    return data;
}

// modify room ID (ID/modify-id)
async function modifyID(id) {
    const data = await PUTRoutines("rooms/ID/modify-id", id);
    return data;
}
// http://localhost:3002/rooms/?id=1&name=room1&luminositeMin=0&luminositeMax=100&automatique=true
async function modifyName(roomId, newName, luminositeMin, luminositeMax, automatique) {
    const data = await PUTRoutines("rooms/" + roomId + "/" + newName + "/" + luminositeMin + "/" + luminositeMax + "/" + automatique);
    return data;
}

// Change the configuration of a room (configuration/modify-room)
async function modifyRoom(room) {
    const data = await PUTRoutines("rooms/configuration/", room);
    return data;
}


// Modify the state of blinders
// http://localhost:3002/rooms/house1/blinds
async function modifyBlinds(roomId, newBlinds) {
    try {
        console.log(`Sending request to modify blinds for room ${roomId} with value ${newBlinds}`);
        const response = await fetch(`http://localhost:3002/rooms/${roomId}/blinds`, { // Utiliser une URL absolue
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blinds: newBlinds }), // Envoyer les données sous forme d'objet JSON
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Response from server:', data);
        return data;
    } catch (error) {
        console.error('Error in modifyBlinds:', error);
        throw error;
    }
}

const modifyLuminosity = async (roomId, minLuminosity, maxLuminosity) => {
    try {
        const response = await fetch(`http://localhost:3002/rooms/${roomId}/luminosity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ minLuminosity, maxLuminosity })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response from modifyLuminosity:', data);
    } catch (error) {
        console.error('Error modifying room luminosity:', error);
    }
};
// router.get('/latest/:room', (req, res) => {
async function getLatestDataForRoom(data, room) {
    try {
        const data = await fetchRoutines(`/data/latest/${room}`);
        return data;
    } catch (error) {
        console.error('Error fetching latest data for room:', error);
        throw error;
    }
}


// export the functions
module.exports.fetchRooms = fetchRooms;
module.exports.fetchData = fetchData;
module.exports.fetchID = fetchID;
module.exports.createRoom = createRoom;
module.exports.deleteRoom = deleteRoom;
module.exports.modifyID = modifyID;
module.exports.modifyName = modifyName;
module.exports.modifyRoom = modifyRoom;
module.exports.modifyBlinds = modifyBlinds;
module.exports.modifyLuminosity = modifyLuminosity;