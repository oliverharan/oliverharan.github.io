import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditLens = ({ lenses, editLens }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lens = lenses.find((lens) => lens.id === parseInt(id));
  
  const [formData, setFormData] = useState({
    focalLength: '',
    maximumAperture: '',
    lensMount: '',
    lensFormatCoverage: '',
    focusType: '',
    filterSize: '',
    minimumAperture: '',
    angleOfView: '',
    minimumFocusDistance: '',
    opticalDesign: '',
    imageStabilization: '',
  });

  useEffect(() => {
    if (lens) {
      setFormData(lens);
    }
  }, [lens]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editLens({ ...formData, id: lens.id });
    navigate('/');
  };

  if (!lens) {
    return <div>Lens not found!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Lens</h2>
      <div>
        <label>Focal Length:</label>
        <input type="text" name="focalLength" value={formData.focalLength} onChange={handleChange} />
      </div>
      {/* Repeat for other fields */}
      <button type="submit">Save</button>
    </form>
  );
};

export default EditLens;
