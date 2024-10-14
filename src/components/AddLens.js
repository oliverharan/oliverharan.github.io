import React, { useState } from "react";
import axios from "axios";

function AddLens() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    focalLength: "",
    maxAperture: "",
    lensMount: "",
    filterSize: "",
    imgUrl: "", // Will hold the Imgur image URL
  });
  const [imageFile, setImageFile] = useState(null); // Store the selected image file
  const [uploading, setUploading] = useState(false); // Track the upload status

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Store the image file on file input change
  };

  const uploadImageToImgur = async () => {
    const clientId = '131a16b091d6516'; // Use Imgur Client ID for anonymous uploads
  
    if (!imageFile) {
      alert('Image missing.');
      return;
    }
  
    const imgurFormData = new FormData();
    imgurFormData.append("image", imageFile);
  
    try {
      const response = await axios.post(
        "https://api.imgur.com/3/image",
        imgurFormData,
        {
          headers: {
            Authorization: `Client-ID ${clientId}`, // Use Client-ID for anonymous uploads
          },
        }
      );
      return response.data.data.link;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    const uploadedImageUrl = await uploadImageToImgur();

    if (!uploadedImageUrl) {
      setUploading(false);
      return;
    }

    try {
      // Prepare lens data with the Imgur image URL
      const lensData = { ...formData, imgUrl: uploadedImageUrl };

      // Send the POST request to your API
      const response = await axios.post("https://lens-api-7hy7.onrender.com/lenses", lensData);
      console.log("Lens added successfully:", response.data);

      // Clear form after successful submission
      setFormData({
        make: "",
        model: "",
        focalLength: "",
        maxAperture: "",
        lensMount: "",
        filterSize: "",
        imgUrl: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding lens:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Lens</h3>
      <label>
        Manufacturer:
        <select name="make" value={formData.make} onChange={handleChange}>
          <option value="Nikon">Nikon</option>
          <option value="Canon">Canon</option>
          <option value="Sony">Sony</option>
          <option value="Fujifilm">Fujifilm</option>
          <option value="Panasonic">Panasonic</option>
        </select>
      </label>
      <br />
      <label>
        Model:
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Focal Length:
        <input
          type="text"
          name="focalLength"
          value={formData.focalLength}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Maximum Aperture:
        <input
          type="text"
          name="maxAperture"
          value={formData.maxAperture}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Lens Mount:
        <input
          type="text"
          name="lensMount"
          value={formData.lensMount}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Filter Size:
        <input
          type="text"
          name="filterSize"
          value={formData.filterSize}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Upload Image:
        <input type="file" onChange={handleImageChange} />
      </label>
      <br />
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Add Lens"}
      </button>
    </form>
  );
}

export default AddLens;
