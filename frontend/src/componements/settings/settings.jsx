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
      <div className="settings-container">
        <div className="content-area">
          <h1 className="settings-title">User Settings</h1>
          {isEditing ? (
            <form className="settings-form">
              <label className="settings-label">
                Name:
                <input type="text" value={name} onChange={handleNameChange} className="settings-input name-input" />
              </label>
              <label className="settings-label">
                Profile Picture:
                <input type="file" onChange={handleProfilePictureChange} className="settings-input profile-picture-input" />
              </label>
              <button onClick={handleSaveClick} className="settings-button save-button">Save</button>
            </form>
          ) : (
            <div>
              <h2>{name}</h2>
              <img src={profilePicture} alt="Profile" className="profile-picture" />
              <button onClick={handleEditClick} className="settings-button edit-button">Edit</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserSettings;