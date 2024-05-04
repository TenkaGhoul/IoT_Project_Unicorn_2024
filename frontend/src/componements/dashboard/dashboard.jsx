import React, { useState, useEffect } from 'react';
import { fetchRooms, createRoom, deleteRoom } from '../../data/dataManagementLayer';
import Header from '../header/header';

import './dashboard.css';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState(null);

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
      setRooms([...rooms, roomFromServer]);
      setNewRoomName('');
    } catch (error) {
      console.error('Error creating room:', error);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <Header />
      </header>
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="rooms">
          {rooms.length > 0 ? rooms.map((room, index) => (
            <div className={`room room-${index}`} key={room.id}>
              <h2 className="room-name">Room : {room.name}</h2>
              <p className="room-id">ID: {room.id}</p>
              <hr className="room-divider" />
              <p className="room-luminosity-max">Luminosity Max: {room.luminositeMax}</p>
              <p className="room-luminosity-min">Luminosity Min: {room.luminositeMin}</p>
              <p className="room-automatic">Automatic: {room.automatique}</p>
              <p className="room-blinds">Blinds: {room.blinds}</p>
              <hr className="room-divider" />
              <button className="room-delete-button" onClick={() => handleRemoveRoom(room.id)}>Delete</button>
            </div>
          )) : <p className="rooms-empty-message">No rooms to display</p>}
        </div>
        <hr className="dashboard-divider" />
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
    </div>
  );
}

export default Dashboard;