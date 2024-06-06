import React, { useState, useEffect } from 'react';
import './storeControl.css';

const StoreControl = ({ onChange }) => {
    const [brightness, setBrightness] = useState(() => {
        // Get the initial value from localStorage if it exists, otherwise use 0
        const savedBlinds = localStorage.getItem('blinds');
        return savedBlinds !== null ? Number(savedBlinds) : 0;
    });

    useEffect(() => {
        localStorage.setItem('blinds', brightness);
    }, [brightness]);

    const handleBrightnessChange = (event) => {
        const newBrightness = parseInt(event.target.value);
        setBrightness(newBrightness);
        onChange(newBrightness);
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