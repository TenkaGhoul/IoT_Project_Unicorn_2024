import React, { useState, useEffect } from 'react';
import { fetchRooms, createRoom, deleteRoom, modifyName, modifyBlinds, modifyLuminosity } from '../../data/dataManagementLayer';
import { Link } from 'react-router-dom';
import Header from '../header/header';
import StoreControl from '../storeControl/storeControl';

import './dashboard.css';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [editRoomName, setEditRoomName] = useState('');
  const [roomBeingEdited, setRoomBeingEdited] = useState(null);
  const [editLuminosityMin, setEditLuminosityMin] = useState('');
  const [editLuminosityMax, setEditLuminosityMax] = useState('');
  const [error, setError] = useState(null);
  const [blinds, setBlinds] = useState(() => {
    // Get the initial value from localStorage if it exists, otherwise use 100
    const savedBlinds = localStorage.getItem('blinds');
    return savedBlinds !== null ? Number(savedBlinds) : 0;
  });

  useEffect(() => {
    localStorage.setItem('blinds', blinds);
  }, [blinds]);

  useEffect(() => {
    const getRooms = async () => {
      try {
        let roomsFromServer = await fetchRooms();
        if (typeof roomsFromServer === 'object' && !Array.isArray(roomsFromServer)) {
          roomsFromServer = Object.values(roomsFromServer);
        }
        if (Array.isArray(roomsFromServer)) {
          setRooms(roomsFromServer);
        } else {
          console.log('Response from fetchRooms:', roomsFromServer);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError(error.toString());
      }
    };

    getRooms();
  }, []);

  const handleAddRoom = async (event) => {
    event.preventDefault();
    const newRoom = { name: newRoomName };
    try {
      const roomFromServer = await createRoom(newRoom.name);
      setRooms((prevRooms) => [...prevRooms, roomFromServer]);
      setNewRoomName('');
      window.location.reload(); // Recharger la page pour afficher la nouvelle salle
    } catch (error) {
      console.error('Error creating room:', error);
      setError(error.toString());
    }
  };

  const handleBlindsChange = async (roomId, newBlinds) => {
    console.log(`Attempting to change blinds for room ${roomId} with value ${newBlinds}`);
    try {
      const response = await modifyBlinds(roomId, newBlinds);
      console.log('Response from modifyBlinds:', response);
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.id === roomId) {
          return { ...room, blinds: newBlinds };
        }
        return room;
      }));
    } catch (error) {
      console.error('Error modifying blinds:', error);
      setError(error.toString());
    }
  };

  const handleModification = async (roomId, newName, luminositeMin, luminositeMax) => {
    try {
      await modifyName(roomId, newName, luminositeMin, luminositeMax);
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.id === roomId) {
          return { ...room, name: newName, luminositeMin: editLuminosityMin, luminositeMax: editLuminosityMax };
        }
        return room;
      }));
      setRoomBeingEdited(null); // Reset the room being edited
    } catch (error) {
      console.error('Error modifying room :', error);
      setError(error.toString());
    }
  };

  const handleRemoveRoom = async (roomId) => {
    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter(room => room.id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
      setError(error.toString());
    }
  };

  const handleLuminosityChange = (roomName, period) => {
    const luminosityValues = {
      night: { min: 0, max: 300 },
      morning: { min: 300, max: 600 },
      day: { min: 600, max: 900 },
      afternoon: { min: 900, max: 1200 },
      evening: { min: 1200, max: 1500 }
    };

    const { min, max } = luminosityValues[period];

    setRooms((prevRooms) => prevRooms.map((room) => {
      if (room.name === roomName) {
        return { ...room, luminositeMin: min, luminositeMax: max };
      }
      return room;
    }));

    modifyLuminosity(roomName, min, max); // Appel de la fonction pour envoyer la demande de modification de la luminosité au serveur
  };


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="header">
        <Header />
      </header>
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="rooms">
          {rooms.length > 0 ? rooms.map((room, index) => (
              <div className={`room room-${index}`} key={index}>
                <div className="room-header">
                  <h2 className="room-name">Room : {room.name}</h2>
                  <Link to="/simulation">
                    <img
                        src="https://github.com/TenkaGhoul/IoT_Project_Unicorn_2024/blob/frontend-paul/src/info.png?raw=true"
                        alt="Go to simulation"
                        className="simulation-link"
                        title="If you want to see how bright you want your room to be."
                    />
                  </Link>
                </div>
                <p className="room-id">ID: {room.id}</p>
                <hr className="room-divider"/>
                {room.automatique && (
                    <>
                      <p className="room-luminosity-max">Maximum Luminosity: {room.luminositeMax}</p>
                      <p className="room-luminosity-min">Minimum Luminosity: {room.luminositeMin}</p>
                      <p className="room-blinds">Blinders opening: {room.blinds} %</p>
                      <p className="room-automatic">Automatic configuration: {room.automatique ? 'True' : 'False'}</p>
                    </>
                )}
                {room.automatique === false && (
                    <>
                      <StoreControl onChange={(value) => {
                        setBlinds(value);
                      }}/>
                      <p className="room-blinds">Blinders opening: {blinds} %</p>
                      <button onClick={() => handleBlindsChange(room.name, blinds)}>Save</button>
                      <p className="room-automatic">Automatic configuration: {room.automatique ? 'True' : 'False'}</p>
                    </>
                )}
                <hr className="room-divider"/>
                <div className="room-actions">
                  <button className="room-delete-button" onClick={() => handleRemoveRoom(room.id)}>Delete</button>
                  <button className="room-edit-button" onClick={() => {
                    setRoomBeingEdited(room.id);
                    setEditRoomName(room.name);
                  }}>Edit
                  </button>
                  {roomBeingEdited === room.id && (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleModification(room.id, editRoomName, editLuminosityMin, editLuminosityMax);
                      }}>
                        <input
                            className="room-name-input"
                            type="text"
                            value={editRoomName}
                            onChange={(e) => setEditRoomName(e.target.value)}
                            placeholder="Enter new room name"
                            required
                        />
                        <input
                            className="room-luminosity-input"
                            type="number"
                            value={editLuminosityMin}
                            onChange={(e) => setEditLuminosityMin(e.target.value)}
                            placeholder="Enter new min luminosity"
                            required
                        />
                        <input
                            className="room-luminosity-input"
                            type="number"
                            value={editLuminosityMax}
                            onChange={(e) => setEditLuminosityMax(e.target.value)}
                            placeholder="Enter new max luminosity"
                            required
                        />
                        <button type="submit" className="room-edit-button">Save</button>
                      </form>
                  )}
                </div>
                <div>
                  <button onClick={() => handleLuminosityChange(room.name, 'night')}>Night</button>
                  <button onClick={() => handleLuminosityChange(room.name, 'morning')}>Morning</button>
                  <button onClick={() => handleLuminosityChange(room.name, 'day')}>Day</button>
                  <button onClick={() => handleLuminosityChange(room.name, 'afternoon')}>Afternoon</button>
                  <button onClick={() => handleLuminosityChange(room.name, 'evening')}>Evening</button>
                </div>
              </div>
          )) : <p>No rooms available</p>}
        </div>
        <hr className="dashboard-divider"/>
        <form className="room-add-form" onSubmit={handleAddRoom}>
          <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name"
              required
              className="room-name-input"
          />
          <button type="submit" className="room-add-button">Add Room</button>
        </form>
      </div>
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default Dashboard;