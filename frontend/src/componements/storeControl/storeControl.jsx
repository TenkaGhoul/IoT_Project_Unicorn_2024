import React, { useState, useEffect } from 'react';
import './storeControl.css';

const StoreControl = ({ room, onChange }) => {
    const [brightness, setBrightness] = useState(() => {
        const savedBrightness = localStorage.getItem(`brightness-${room}`);
        return savedBrightness !== null ? Number(savedBrightness) : 0;
    });

    const [blinds, setBlinds] = useState(() => {
        const savedBlinds = localStorage.getItem(`blinds-${room}`);
        return savedBlinds !== null ? JSON.parse(savedBlinds) : {};
    });

    useEffect(() => {
        localStorage.setItem(`brightness-${room}`, brightness);
        localStorage.setItem(`blinds-${room}`, JSON.stringify(blinds));
    }, [brightness, blinds, room]);

    const handleBrightnessChange = (event) => {
        const newBrightness = parseInt(event.target.value);
        setBrightness(newBrightness);
        onChange(newBrightness);
    };

    const handleBlindsChange = (event) => {
        const newBlinds = event.target.value;
        setBlinds(newBlinds);
        // Call your onChange handler here if you have one for blinds
    };

    const getBlackLayerStyle = () => {
        const percentage = 100 - brightness;
        return {
            height: `${percentage}%`
        };
    };

    return (
        <div className="store-control">
            <h2>Manual Brightness Control</h2>
            <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={handleBrightnessChange}
                className="slider"
            />
            <div className="color-display">
                <div className="black-layer" style={getBlackLayerStyle()}></div>
            </div>
            <div className="brightness-display">Brightness: {brightness}</div>
        </div>
    );
};

export default StoreControl;