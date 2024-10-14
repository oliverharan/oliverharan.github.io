import React, { useState } from "react";

const LensForm = ({ addLens }) => {
  const [lens, setLens] = useState({
    make: "",
    model: "",
    focalLength: "",
    maxAperture: "",
    lensMount: "",
    focusType: "",
    filterSize: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLens({ ...lens, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setLens({ ...lens, image: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addLens(lens);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Make:
        <select name="make" value={lens.make} onChange={handleInputChange}>
          <option value="Nikon">Nikon</option>
          <option value="Canon">Canon</option>
          <option value="Sony">Sony</option>
          {/* Add more manufacturers here */}
        </select>
      </label>
      <label>
        Model:
        <input type="text" name="model" value={lens.model} onChange={handleInputChange} />
      </label>
      <label>
        Focal Length:
        <input type="text" name="focalLength" value={lens.focalLength} onChange={handleInputChange} />
      </label>
      <label>
        Maximum Aperture:
        <input type="text" name="maxAperture" value={lens.maxAperture} onChange={handleInputChange} />
      </label>
      <label>
        Lens Mount:
        <input type="text" name="lensMount" value={lens.lensMount} onChange={handleInputChange} />
      </label>
      <label>
        Focus Type:
        <input type="text" name="focusType" value={lens.focusType} onChange={handleInputChange} />
      </label>
      <label>
        Filter Size:
        <input type="text" name="filterSize" value={lens.filterSize} onChange={handleInputChange} />
      </label>
      <label>
        Upload Image:
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>
      <button type="submit">Add Lens</button>
    </form>
  );
};

export default LensForm;
