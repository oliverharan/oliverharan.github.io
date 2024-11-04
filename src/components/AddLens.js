import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddLens = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    manufacturer: '',
    focalLength: '',
    maxAperture: '',
    lensMount: '',
    lensFormat: '',
    focusType: '',
    imageStabilization: '',
    filterSize: '',
    minAperture: '',
    angleOfView: '',
    minFocusDistance: '',
    maxMagnification: '',
    opticalDesign: '',
    diaphragmBlades: '',
    dimensions: '',
    maxExtension: '',
    weight: '',
  });
  
  const [image, setImage] = useState(null); // State for the image

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Get the uploaded file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle image upload here (if needed)
    // You can upload the image to a server or Imgur here
    // For example, using FormData to send both form data and image

    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
    if (image) {
      formDataToSubmit.append('image', image); // Append image to FormData
    }

    // Replace this with your actual submission logic
    console.log(formDataToSubmit);
  };

  return (
    <Container>
      <h1>Add a New Lens</h1>
      <Form onSubmit={handleSubmit}>
        {/* Title */}
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {/* Description */}
        <Row>
          <Col>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3}
                name="formDescription"
                value={formData.formDescription}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>
        {/* Focal Length and Maximum Aperture */}
        <Row>
          <Col>
            <Form.Group controlId="formManufacturer" className="mb-3">
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control
                type="text"
                name="formManufacturer"
                value={formData.formManufacturer}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>
        {/* Focal Length and Maximum Aperture */}
        <Row>
          <Col>
            <Form.Group controlId="formFocalLength" className="mb-3">
              <Form.Label>Focal Length</Form.Label>
              <Form.Control
                type="text"
                name="focalLength"
                value={formData.focalLength}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formMaxAperture" className="mb-3">
              <Form.Label>Maximum Aperture</Form.Label>
              <Form.Control
                type="text"
                name="maxAperture"
                value={formData.maxAperture}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Lens Mount and Lens Format Coverage */}
        <Row>
          <Col>
            <Form.Group controlId="formLensMount" className="mb-3">
              <Form.Label>Lens Mount</Form.Label>
              <Form.Control
                type="text"
                name="lensMount"
                value={formData.lensMount}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formLensFormat" className="mb-3">
              <Form.Label>Lens Format Coverage</Form.Label>
              <Form.Control
                type="text"
                name="lensFormat"
                value={formData.lensFormat}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Focus Type and Image Stabilization */}
        <Row>
          <Col>
            <Form.Group controlId="formFocusType" className="mb-3">
              <Form.Label>Focus Type</Form.Label>
              <Form.Control
                type="text"
                name="focusType"
                value={formData.focusType}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formImageStabilization" className="mb-3">
              <Form.Label>Image Stabilization</Form.Label>
              <Form.Control
                type="text"
                name="imageStabilization"
                value={formData.imageStabilization}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Filter Size and Minimum Aperture */}
        <Row>
          <Col>
            <Form.Group controlId="formFilterSize" className="mb-3">
              <Form.Label>Filter Size</Form.Label>
              <Form.Control
                type="text"
                name="filterSize"
                value={formData.filterSize}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formMinAperture" className="mb-3">
              <Form.Label>Minimum Aperture</Form.Label>
              <Form.Control
                type="text"
                name="minAperture"
                value={formData.minAperture}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Angle of View and Minimum Focus Distance */}
        <Row>
          <Col>
            <Form.Group controlId="formAngleOfView" className="mb-3">
              <Form.Label>Angle of View</Form.Label>
              <Form.Control
                type="text"
                name="angleOfView"
                value={formData.angleOfView}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formMinFocusDistance" className="mb-3">
              <Form.Label>Minimum Focus Distance</Form.Label>
              <Form.Control
                type="text"
                name="minFocusDistance"
                value={formData.minFocusDistance}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Maximum Magnification and Optical Design */}
        <Row>
          <Col>
            <Form.Group controlId="formMaxMagnification" className="mb-3">
              <Form.Label>Maximum Magnification</Form.Label>
              <Form.Control
                type="text"
                name="maxMagnification"
                value={formData.maxMagnification}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formOpticalDesign" className="mb-3">
              <Form.Label>Optical Design</Form.Label>
              <Form.Control
                type="text"
                name="opticalDesign"
                value={formData.opticalDesign}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Diaphragm Blades and Dimensions */}
        <Row>
          <Col>
            <Form.Group controlId="formDiaphragmBlades" className="mb-3">
              <Form.Label>Diaphragm Blades</Form.Label>
              <Form.Control
                type="text"
                name="diaphragmBlades"
                value={formData.diaphragmBlades}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDimensions" className="mb-3">
              <Form.Label>Dimensions</Form.Label>
              <Form.Control
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Length at Maximum Extension and Weight */}
        <Row>
          <Col>
            <Form.Group controlId="formMaxExtension" className="mb-3">
              <Form.Label>Length at Maximum Extension</Form.Label>
              <Form.Control
                type="text"
                name="maxExtension"
                value={formData.maxExtension}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formWeight" className="mb-3">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Image Upload */}
        <Form.Group controlId="formImage" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Lens
        </Button>
      </Form>
    </Container>
  );
};

export default AddLens;
