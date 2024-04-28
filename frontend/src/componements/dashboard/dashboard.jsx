import React, { useState } from 'react';

// Composant pour représenter une pièce individuelle
const RoomCard = ({ room, onRemove, onEditTemperature, onEditHumidity }) => {
  const [newTemperature, setNewTemperature] = useState(room.temperature);
  const [newHumidity, setNewHumidity] = useState(room.humidity);

  const handleTemperatureChange = (event) => {
    setNewTemperature(parseInt(event.target.value));
  };

  const handleHumidityChange = (event) => {
    setNewHumidity(parseInt(event.target.value));
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
      <h3>{room.name}</h3>
      <div>
        Température : {room.temperature}°C{' '}
        <input type="number" value={newTemperature} onChange={handleTemperatureChange} />
        <button onClick={() => onEditTemperature(room.id, newTemperature)}>Modifier</button>
      </div>
      <div>
        Humidité : {room.humidity}%{' '}
        <input type="number" value={newHumidity} onChange={handleHumidityChange} />
        <button onClick={() => onEditHumidity(room.id, newHumidity)}>Modifier</button>
      </div>
      <button onClick={() => onRemove(room.id)}>Supprimer</button>
    </div>
  );
};

const Dashboard = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Salon', temperature: 22, humidity: 50 },
    { id: 2, name: 'Chambre1', temperature: 20, humidity: 55 },
    { id: 3, name: 'Chambre2', temperature: 21, humidity: 53 },
    { id: 4, name: 'Cuisine', temperature: 19, humidity: 60 },
    { id: 5, name: 'Salle de bain', temperature: 23, humidity: 48 },
  ]);

  const handleAddRoom = (newRoom) => {
    setRooms([...rooms, newRoom]);
  };

  const handleRemoveRoom = (roomId) => {
    const updatedRooms = rooms.filter(room => room.id !== roomId);
    setRooms(updatedRooms);
  };

  const handleEditTemperature = (roomId, newTemperature) => {
    const updatedRooms = rooms.map(room =>
      room.id === roomId ? { ...room, temperature: newTemperature } : room
    );
    setRooms(updatedRooms);
  };

  const handleEditHumidity = (roomId, newHumidity) => {
    const updatedRooms = rooms.map(room =>
      room.id === roomId ? { ...room, humidity: newHumidity } : room
    );
    setRooms(updatedRooms);
  };

  return (
    <div>
      <h1>Tableau de bord de la maison</h1>
      <div>
        <h2>Ajouter une nouvelle pièce</h2>
        <RoomForm onAddRoom={handleAddRoom} />
      </div>
      <div>
        <h2>Pièces de la maison</h2>
        {rooms.map(room => (
          <RoomCard
            key={room.id}
            room={room}
            onRemove={handleRemoveRoom}
            onEditTemperature={handleEditTemperature}
            onEditHumidity={handleEditHumidity}
          />
        ))}
      </div>
    </div>
  );
};

// Composant pour le formulaire d'ajout de pièce
const RoomForm = ({ onAddRoom }) => {
  const [name, setName] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name.trim() !== '') {
      onAddRoom({ id: Date.now(), name, temperature, humidity });
      setName('');
      setTemperature(0);
      setHumidity(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nom de la nouvelle pièce" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="Température (°C)" value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))} />
      <input type="number" placeholder="Humidité (%)" value={humidity} onChange={(e) => setHumidity(parseInt(e.target.value))} />
      <button type="submit">Ajouter une pièce</button>
    </form>
  );
};

export default Dashboard;