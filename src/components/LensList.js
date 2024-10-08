import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LensList = () => {
  const [lenses, setLenses] = useState([]);
  const [newLens, setNewLens] = useState({ name: '', description: '' });
  const navigate = useNavigate(); // For navigation to lens detail page

  useEffect(() => {
    // Fetch lenses from the API
    const fetchLenses = async () => {
      try {
        const response = await axios.get('https://lens-api-7hy7.onrender.com/lenses');
        setLenses(response.data);
      } catch (error) {
        console.error('Error fetching lenses:', error);
      }
    };
    fetchLenses();
  }, []);

  // Add a new lens
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://lens-api-7hy7.onrender.com/lenses', newLens);
      setLenses([...lenses, response.data]);
      setNewLens({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding lens:', error);
    }
  };

  // Delete a lens
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://lens-api-7hy7.onrender.com/lenses/${id}`);
      setLenses(lenses.filter((lens) => lens.id !== id));
    } catch (error) {
      console.error('Error deleting lens:', error);
    }
  };

  // Navigate to lens detail page
  const handleSelect = (id) => {
    navigate(`/lenses/${id}`); // Navigates to the lens detail page
  };

  return (
    <div className="container mt-4">
      <h2>My Lens Collection</h2>

      {/* Add Lens Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Lens Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={newLens.name}
            onChange={(e) => setNewLens({ ...newLens, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={newLens.description}
            onChange={(e) => setNewLens({ ...newLens, description: e.target.value })}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Add Lens</button>
      </form>

      {/* List of Lenses */}
      <div className="list-group mt-4">
        {lenses.map((lens) => (
          <div
            key={lens.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => handleSelect(lens.id)} // Navigate to lens detail page
          >
            <div>
              <h5>{lens.name}</h5>
              <p>{lens.description}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents click event propagation
                handleDelete(lens.id);
              }}
              className="btn btn-danger"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LensList;
