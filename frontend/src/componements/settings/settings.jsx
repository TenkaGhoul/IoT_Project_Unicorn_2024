// settings.jsx
import React, { useState, useEffect } from 'react';
import Header from '../header/header';
import './settings.css';

const UserSettings = () => {
  const defaultProfilePicture = 'https://github.com/TenkaGhoul/IoT_Project_Unicorn_2024/blob/frontend-paul/src/default.jpg?raw=true';
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleProfilePictureChange = (event) => {
    setProfilePicture(URL.createObjectURL(event.target.files[0]));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Header />
      <div className="settings">
        <div className="settings-header">
          <h1 className="settings-title">Welcome {name} on your settings page</h1>
        </div>
        {isEditing ? (
          <form className="settings-form">
            <label className="settings-label">
              Name:
              <input type="text" value={name} onChange={handleNameChange} className="settings-input settings-name-input" />
            </label>
            <label className="settings-label">
              Profile Picture:
              <input type="file" onChange={handleProfilePictureChange} className="settings-input settings-avatar-input" />
            </label>
            <button type="button" onClick={handleSaveClick} className="settings-button">Save</button>
          </form>
        ) : (
          <div className="settings-profile">
            <div className="settings-profile-info">
              <img src={profilePicture} alt="Profile" className="settings-avatar" />
              <h2 className="settings-username">{name}</h2>
            </div>
            <button type="button" onClick={handleEditClick} className="settings-button">Edit</button>
          </div>
        )}
      </div>
    </>
  );
}

export default UserSettings;