import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LensDetails = ({ lenses, editLens, deleteLens }) => {
  const { id } = useParams();  // Get the ID from the URL parameters
  const navigate = useNavigate();

  // Ensure that both ID types (string and number) work correctly
  const lens = lenses.find((lens) => lens.id === id || lens.id === parseInt(id));

  const handleDelete = () => {
    if (lens) {
      deleteLens(lens.id);
      navigate('/');
    }
  };

  if (!lens) {
    return <div>Lens not found!</div>;
  }

  return (
    <div>
      <h2>Lens Details</h2>
      <div>
        <strong>Focal Length:</strong> {lens.focalLength}
      </div>
      <div>
        <strong>Maximum Aperture:</strong> {lens.maximumAperture}
      </div>
      <div>
        <strong>Lens Mount:</strong> {lens.lensMount}
      </div>
      <div>
        <strong>Lens Format Coverage:</strong> {lens.lensFormatCoverage}
      </div>
      <div>
        <strong>Focus Type:</strong> {lens.focusType}
      </div>
      <div>
        <strong>Filter Size:</strong> {lens.filterSize}
      </div>
      <div>
        <strong>Minimum Aperture:</strong> {lens.minimumAperture}
      </div>
      <div>
        <strong>Angle of View:</strong> {lens.angleOfView}
      </div>
      <div>
        <strong>Minimum Focus Distance:</strong> {lens.minimumFocusDistance}
      </div>
      <div>
        <strong>Optical Design:</strong> {lens.opticalDesign}
      </div>
      <div>
        <strong>Image Stabilization:</strong> {lens.imageStabilization}
      </div>

      {/* Button to navigate to the edit form */}
      <button onClick={() => navigate(`/edit/${lens.id}`)}>Edit</button>

      {/* Button to handle deleting the lens */}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default LensDetails;
