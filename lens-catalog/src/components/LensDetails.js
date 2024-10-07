import React from 'react';
import { useParams } from 'react-router-dom';

const LensDetails = ({ lenses }) => {
  const { lensId } = useParams();
  const lens = lenses.find((l) => l.id === lensId);

  if (!lens) {
    return <div>Lens not found!</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{lens.name}</h2>
      <p>{lens.description}</p>
      <img src={lens.image} alt={lens.name} className="img-fluid" />
    </div>
  );
};

export default LensDetails;
