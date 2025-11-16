import React from 'react';
import PlantTracker from './components/PlantTracker';
import './components/PlantTracker.css'; // Import the CSS here

function App() {
    // Apply the wrapper div here to center the entire component
    return (
        <div className="plant-tracker-wrapper">
            <PlantTracker />
        </div>
    );
}

export default App;