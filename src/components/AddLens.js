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

  // Handle input changes for form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file input change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Store the image file on file input change
    console.log("Selected image file:", e.target.files[0]); // Debugging log for image file
  };

  // Function to upload image to Imgur
  const uploadImageToImgur = async () => {
    const clientId = '131a16b091d6516'; // Use Imgur Client ID for anonymous uploads
  
    if (!imageFile) {
      alert('Image missing.');
      return;
    }
  
    const imgurFormData = new FormData();
    imgurFormData.append("image", imageFile);
  
    try {
      console.log("Uploading image to Imgur..."); // Debugging log before upload
      const response = await axios.post(
        "https://api.imgur.com/3/image",
        imgurFormData,
        {
          headers: {
            Authorization: `Client-ID ${clientId}`, // Use Client-ID for anonymous uploads
          },
        }
      );
      console.log("Image upload successful:", response.data); // Debugging log after successful upload
      return response.data.data.link; // Return the image URL from Imgur
    } catch (error) {
      console.error("Error uploading image:", error); // Debugging log for errors
      return null;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    // Upload the image to Imgur
    const uploadedImageUrl = await uploadImageToImgur();

    if (!uploadedImageUrl) {
      setUploading(false);
      return;
    }

    try {
      // Prepare lens data with the Imgur image URL
      const lensData = { ...formData, imgUrl: uploadedImageUrl };

      // Log the lens data to ensure it's correct
      console.log("Submitting lens data to the API:", lensData); // Debugging log before API submission

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
      // Improved error handling
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from the server. Please try again later.");
      } else {
        console.error("Error setting up the request:", error.message);
        alert("Error: " + error.message);
      }
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
