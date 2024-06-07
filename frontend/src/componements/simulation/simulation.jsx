import React, { useState } from 'react';
import Header from '../header/header';
import './simulation.css';

const Simulation = ({ min, max, step, onChange }) => {
    const [value, setValue] = useState((min + max) / (2 * max));

    const handleChange = (event) => {
        const newValue = Number(event.target.value);
        setValue(newValue / max);
        if (onChange) {
            onChange(newValue);
        }
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
                                className="s-color-display"
                                id="backgroundImage"
                                style={{ filter: `brightness(${value})` }}
                            ></div>
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={value * max}
                                onChange={handleChange}
                                className="slider"
                            />
                            <div className="value-display">{value * max} lux</div>
                        </div>
                        <p className="simulation-explanation">If you want to see how bright you want your room to be, use the slider above to adjust the brightness.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Simulation;