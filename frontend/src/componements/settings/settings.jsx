import React, { useState, useEffect } from 'react';
import Header from '../header/header';

const UserSettings = () => {
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('name', name);
    localStorage.setItem('profilePicture', profilePicture);
  }, [name, profilePicture]);

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
    <div className="user-settings">
      <Header />
      <h1 className="user-settings-title">User Settings</h1>
      {isEditing ? (
        <form className="user-settings-form">
          <label className="user-settings-label">
            Name:
            <input type="text" value={name} onChange={handleNameChange} className="user-settings-input" />
          </label>
          <label className="user-settings-label">
            Profile Picture:
            <input type="file" onChange={handleProfilePictureChange} className="user-settings-input" />
          </label>
          <button onClick={handleSaveClick}>Save</button>
        </form>
      ) : (
        <div>
          <h2>{name}</h2>
          {profilePicture && <img src={profilePicture} alt="Profile" className="user-settings-profile-picture" />}
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default UserSettings;