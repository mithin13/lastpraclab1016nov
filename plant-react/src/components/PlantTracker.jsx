import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlantTracker.css';
import config from './config';

const PlantTracker = () => {
    const [plants, setPlants] = useState([]);
    const [plant, setPlant] = useState({ id: '', name: '', species: '', wateringSchedule: '', lastWateredDate: '', healthStatus: '' });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // New state for fetching by ID
    const [idToFetch, setIdToFetch] = useState('');
    const [fetchedPlant, setFetchedPlant] = useState(null);

    //const baseUrl = `${config.url}/plant-api`;
    const baseUrl = `${import.meta.env.VITE_API_URL}/plant-api`;

    useEffect(() => {
        fetchAllPlants();
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchAllPlants = async () => {
        try {
            const response = await axios.get(`${baseUrl}/all`);
            setPlants(response.data);
        } catch (error) {
            setMessage(`Error: ${error.response?.data || 'Could not fetch plants.'}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlant({ ...plant, [name]: value });
    };

    // New function to fetch a single plant by ID
    const getPlantById = async () => {
        if (!idToFetch) {
            setMessage("Please enter a Plant ID to fetch.");
            setFetchedPlant(null); // Clear previous results
            return;
        }
        try {
            const response = await axios.get(`${baseUrl}/get/${idToFetch}`);
            setFetchedPlant(response.data);
            setMessage('Plant found successfully!');
        } catch (error) {
            setFetchedPlant(null);
            setMessage(`Error: ${error.response?.data || 'Plant not found.'}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!plant.name || !plant.species) {
            setMessage('Error: Plant Name and Species are required.');
            return;
        }

        const url = isEditing ? `${baseUrl}/update/${plant.id}` : `${baseUrl}/add`;
        const method = isEditing ? 'put' : 'post';

        try {
            await axios[method](url, plant);
            setMessage(`Plant ${isEditing ? 'updated' : 'added'} successfully!`);
            fetchAllPlants();
            resetForm();
        } catch (error) {
            setMessage(`Error: ${error.response?.data || 'Could not save the plant.'}`);
        }
    };

    const handleEdit = (plantToEdit) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsEditing(true);
        setPlant(plantToEdit);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this plant from your tracker?')) {
            try {
                await axios.delete(`${baseUrl}/delete/${id}`);
                setMessage('Plant removed successfully!');
                fetchAllPlants();
            } catch (error) {
                setMessage(`Error: ${error.response?.data || 'Could not remove the plant.'}`);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setPlant({ id: '', name: '', species: '', wateringSchedule: '', lastWateredDate: '', healthStatus: '' });
    };

    return (
        <div className="plant-tracker-wrapper"> {/* Added wrapper for centering */}
            <div className="plant-tracker-container">
                <header className="tracker-header">
                    <h1>Personal Plant Tracker <span role="img" aria-label="plant emoji">🌱</span></h1>
                    <p>A digital log for your green friends</p>
                </header>

                <div className="form-section">
                    <h2>{isEditing ? 'Update Plant Details' : 'Add a New Plant'}</h2>
                    <form onSubmit={handleSubmit} className="plant-form">
                        <input type="text" name="name" value={plant.name} onChange={handleInputChange} placeholder="Plant Name (e.g., Freddy)" required />
                        <input type="text" name="species" value={plant.species} onChange={handleInputChange} placeholder="Species (e.g., Monstera Deliciosa)" required />
                        <input type="text" name="wateringSchedule" value={plant.wateringSchedule} onChange={handleInputChange} placeholder="Watering Schedule (e.g., Weekly)" />
                        <input type="date" name="lastWateredDate" value={plant.lastWateredDate} onChange={handleInputChange} />
                        <select name="healthStatus" value={plant.healthStatus} onChange={handleInputChange}>
                            <option value="">Select Health Status</option>
                            <option value="Thriving">Thriving</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Needs Attention">Needs Attention</option>
                            <option value="Unwell">Unwell</option>
                        </select>
                        <div className="form-buttons">
                            <button type="submit" className="btn-submit">{isEditing ? 'Update Plant' : 'Add Plant'}</button>
                            {isEditing && <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>}
                        </div>
                    </form>
                </div>

                {/* --- New Fetch by ID Section --- */}
                <div className="fetch-section">
                    <h2>Find a Plant by ID</h2>
                    <div className="fetch-controls">
                        <input
                            type="number"
                            value={idToFetch}
                            onChange={(e) => setIdToFetch(e.target.value)}
                            placeholder="Enter Plant ID..."
                        />
                        <button onClick={getPlantById} className="btn-fetch">Fetch Plant</button>
                    </div>
                    {fetchedPlant && (
                        <div className="plant-card fetched-plant-card">
                            <h3>{fetchedPlant.name}</h3>
                            <p className="species">{fetchedPlant.species}</p>
                            <div className="plant-details">
                                <p><strong>Watering:</strong> {fetchedPlant.wateringSchedule || 'N/A'}</p>
                                <p><strong>Last Watered:</strong> {fetchedPlant.lastWateredDate || 'N/A'}</p>
                                <p><strong>Status:</strong> <span className={`status-badge status-${fetchedPlant.healthStatus?.replace(/\s+/g, '-').toLowerCase()}`}>{fetchedPlant.healthStatus || 'N/A'}</span></p>
                            </div>
                        </div>
                    )}
                </div>

                {message && <div className={`message-banner ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

                <div className="plant-list-section">
                    <h2>My Plants</h2>
                    {plants.length > 0 ? (
                        <div className="plant-grid">
                            {plants.map((p) => (
                                <div key={p.id} className="plant-card">
                                    <h3>{p.name}</h3>
                                    <p className="species">{p.species}</p>
                                    <div className="plant-details">
                                        <p><strong>Watering:</strong> {p.wateringSchedule || 'N/A'}</p>
                                        <p><strong>Last Watered:</strong> {p.lastWateredDate || 'N/A'}</p>
                                        <p><strong>Status:</strong> <span className={`status-badge status-${p.healthStatus?.replace(/\s+/g, '-').toLowerCase()}`}>{p.healthStatus || 'N/A'}</span></p>
                                    </div>
                                    <div className="card-buttons">
                                        <button onClick={() => handleEdit(p)} className="btn-edit">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="btn-delete">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-plants-message">You haven't added any plants yet. Add one above to get started!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantTracker;