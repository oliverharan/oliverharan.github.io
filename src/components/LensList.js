import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LensList = () => {
  const [lenses, setLenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLensData = async () => {
      try {
        const response = await axios.get('https://lens-api-7hy7.onrender.com/lenses');
        console.log('API Response:', response.data);
        setLenses(response.data); // Directly set lenses if response is an array
      } catch (error) {
        console.error('Error fetching the lens data', error);
        setError('Failed to load lenses.');
      } finally {
        setLoading(false);
      }
    };

    fetchLensData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://lens-api-7hy7.onrender.com/lenses/${id}`);
      const updatedLenses = lenses.filter((lens) => lens.id !== id);
      setLenses(updatedLenses);
    } catch (error) {
      console.error('Error deleting the lens:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
      });
      setError('Failed to delete lens.');
    }
  };

  if (loading) {
    return <div>Loading lenses...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!Array.isArray(lenses) || lenses.length === 0) {
    return <div>No lenses available.</div>;
  }

  return (
    <div>
      <h2>Stored Lenses</h2>
      {lenses.map((lens) => (
        <div key={lens.id}>
          <h3>
            <Link to={`/lens/${lens.id}`}>{lens.focalLength}</Link>
          </h3>
          <p>Maximum Aperture: {lens.maximumAperture}</p>
          <p>Lens Mount: {lens.lensMount}</p>
          <p>Filter Size: {lens.filterSize}</p>
          <p>Focus Type: {lens.focusType}</p>
          {/* Show the uploaded image using imgUrl */}
          {lens.imgUrl && (
            <img src={lens.imgUrl} alt={`${lens.make} ${lens.model}`} />
          )}
          <button onClick={() => handleDelete(lens.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default LensList;
