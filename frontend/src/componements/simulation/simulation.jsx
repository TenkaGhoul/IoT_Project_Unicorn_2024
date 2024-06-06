import React, { useState } from 'react';
import Header from '../header/header';
import './simulation.css';

const Simulation = ({ min, max, step, onChange }) => {
    const [value, setValue] = useState((min + max) / 2);

    const handleChange = (event) => {
        const newValue = Number(event.target.value);
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const getBackgroundColor = () => {
        const percentage = (value - min) / (max - min);
        const colorValue = Math.round(percentage * 255);
        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    };

    return (
        <div className="app">
            <header className="header">
                <Header />
            </header>
            <div className="range-slider-container">
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="simulation-title">Brightness Simulation</h2>
                        <div className="range-slider">
                            <div
                                className="color-display"
                                style={{ backgroundColor: getBackgroundColor() }}
                            ></div>
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={value}
                                onChange={handleChange}
                                className="slider"
                            />
                            <div className="value-display">{value} lux</div>
                        </div>
                        <p className="simulation-explanation">If you want to see how bright you want your room to be, use the slider above to adjust the brightness.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Simulation;