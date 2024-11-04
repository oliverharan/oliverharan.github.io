import React, { useState } from "react";
import { Modal, Button, Container, Form, Row, Col } from "react-bootstrap";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const LensModal = ({ showModal, handleClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    formDescription: "",
    formManufacturer: "",
    minFocalLength: "",
    maxFocalLength: "",
    maxAperture: "",
    lensMount: "",
    lensFormat: "",
    focusType: "",
    filterUV: null,
    imageStabilization: "",
    filterSize: "",
    minAperture: "",
    angleOfView: "",
    minFocusDistance: "",
    maxMagnification: "",
    opticalDesign: "",
    diaphragmBlades: "",
    dimensions: "",
    maxExtension: "",
    weight: "",
  });

  const [images, setImages] = useState([{ file: null, label: "" }]);
  const [mainImageIndex, setMainImageIndex] = useState(0); // State to track the main image
  const lensesCollection = collection(db, "lenses");
  const [links, setLinks] = useState([{label: "", url: ""}]);
  const [category, setCategory] = useState([{category: ""}]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index].file = file;
    setImages(newImages);
  };

  const handleLabelChange = (index, value) => {
    const newImages = [...images];
    newImages[index].label = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, { file: null, label: "" }]);
  };

  // Add new link field
  const addLinkField = () => {
    setLinks([...links, {label: "", url: ""}]);
  };

  
  // Update link input values
  const handleLinkChange = (index, field, value) => {
      const newLinks = [...links];
      newLinks[index][field] = value; // Update either label or url based on field
      setLinks(newLinks);
    };

    const addCategoryField = () => {
      setCategory([...category, {category: ""}]);
    };

  const handleCategoryChange = (index, value) => {
    const newCategory = [...category];
    newCategory[index].category = value;
    setCategory(newCategory);
  };


  const formResetter = () => {
    setFormData({
        title: "",
        formDescription: "",
        formManufacturer: "",
        minFocalLength: "",
        maxFocalLength: "",
        maxAperture: "",
        lensMount: "",
        lensFormat: "",
        focusType: "",
        imageStabilization: "",
        filterSize: "",
        filterUV: null,
        minAperture: "",
        angleOfView: "",
        minFocusDistance: "",
        maxMagnification: "",
        opticalDesign: "",
        diaphragmBlades: "",
        dimensions: "",
        maxExtension: "",
        weight: "",
      });
  
      setImages([{ file: null, label: "" }]); // Reset the image state after submission
      setMainImageIndex(0); // Reset main image selection
      setLinks([{ label: "", url: "" }]); // Reset links after submission
      setCategory([{ category: "" }]);
  }
  const validLinks = links.filter(link => link.url.trim() !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedImages = await Promise.all(
      images.map(async (imageData) => {
        if (imageData.file) {
          const imageRef = ref(storage, `images/${imageData.file.name}`);
          await uploadBytes(imageRef, imageData.file);
          const imageUrl = await getDownloadURL(imageRef);
          return { url: imageUrl, label: imageData.label };
        }
        return null;
      })
    );

    await addDoc(lensesCollection, {
      ...formData,
      images: uploadedImages,
      mainImage: uploadedImages[mainImageIndex]?.url || null, // Set main image URL
      links: validLinks,
      category: category,
    });

    // Reset form after submission
    formResetter();
    handleClose(); // Close the modal
  };

  const handleCancel = () => {
    formResetter();
    handleClose();
  }

  return (
    <Modal show={showModal} onHide={handleClose} size="xl" className="add-lens-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add a New Lens</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group
              controlId="formTitle"
              className="mb-3 d-flex align-items-center"
            >
              <Form.Label className="text-nowrap me-3">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group
                  controlId="formDescription"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="formDescription"
                    value={formData.formDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group
                  controlId="formManufacturer"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Manufacturer
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="formManufacturer"
                    value={formData.formManufacturer}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              </Row>
              <Row>
              <Col>
                <Form.Group
                  controlId="formLensFormat"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Lens Format
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lensFormat"
                    value={formData.lensFormat}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="formLensMount"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Lens Mount
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lensMount"
                    value={formData.lensMount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              </Row>
            <Row>
              <Col>
                <Form.Group
                  controlId="formFocusType"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Focus Type
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="focusType"
                    value={formData.focusType}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Col>
                  <Form.Group
                    controlId="formFilterSize"
                    className="mb-3 d-flex align-items-center"
                  >
                    <Form.Label className="text-nowrap me-3">
                      Filter Size
                    </Form.Label>
                    <Form.Control
                     className="me-3"
                      type="text"
                      name="filterSize"
                      value={formData.filterSize}
                      onChange={handleChange}
                    />
                    <Form.Check
                      className="lens-modal-checkbox"
                      type="checkbox"
                      name="filterUV"
                      label="Has UV"
                    />
                  </Form.Group>
                </Col>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group
                  controlId="formMinAperture"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Min Aperture
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="minAperture"
                    value={formData.minAperture}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="formMaxAperture"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Max Aperture
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="maxAperture"
                    value={formData.maxAperture}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group
                  controlId="formMinFocalLength"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Min Focal Length
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="minFocalLength"
                    value={formData.minFocalLength}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="formMaxFocalLength"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Max Focal Length
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="maxFocalLength"
                    value={formData.maxFocalLength}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group
                  controlId="formImageStabilization"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Image Stabilization
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="imageStabilization"
                    value={formData.imageStabilization}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="formDiaphragmBlades"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Diaphragm Blades
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="diaphragmBlades"
                    value={formData.diaphragmBlades}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group
                  controlId="formAngleOfView"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Angle of View
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="angleOfView"
                    value={formData.angleOfView}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="formMinFocusDistance"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Min Focus Distance
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="minFocusDistance"
                    value={formData.minFocusDistance}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group
                  controlId="formMaxMagnification"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Max Magnification
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="maxMagnification"
                    value={formData.maxMagnification}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="formOpticalDesign"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Optical Design
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="opticalDesign"
                    value={formData.opticalDesign}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group
                  controlId="formDimensions"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                    Dimensions
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="formWeight"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">Weight</Form.Label>
                  <Form.Control
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="d-flex justify-content-end">
                <Button variant="outline-primary" onClick={addCategoryField}>
                  Add Category
                </Button>
              </Col>
            </Row>
            {category.map((category,index) => (
              <Row key={index} className="mb-3">
                <Col className="d-flex">
                  <Form.Group controlId={`formCategoryLabel${index}`} className="me-3 d-flex align-items-center flex-grow-1">
                    <Form.Label className="text-nowrap me-3 multi-col">Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`Category ${index + 1}`}
                      value={category.category}
                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}
            {/* Links Section */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-end">
                <Button variant="outline-primary" onClick={addLinkField}>
                  Add Link
                </Button>
              </Col>
            </Row>
            {links.map((link, index) => (
              <Row key={index} className="mb-3">
                <Col className="d-flex">
                  <Form.Group controlId={`formLinkLabel${index}`} className="me-3 d-flex align-items-center flex-grow-1">
                    <Form.Label className="text-nowrap me-3 multi-col">Label</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`Label ${index + 1}`}
                      value={link.label}
                      onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId={`formLinkUrl${index}`} className="me-3 d-flex align-items-center flex-grow-1">
                    <Form.Label className="text-nowrap me-3 multi-col">Link</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`Link ${index + 1}`}
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}

            {/* Images Section */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-end">
                <Button variant="outline-primary" onClick={addImageField}>
                  Add Another Image
                </Button>
              </Col>
            </Row>
            {images.map((imageData, index) => (
              <Row key={index} className="mb-3">
                <Col md="6">
                  <Form.Group
                    controlId={`formImage${index}`}
                    className="d-flex align-items-center"
                  >
                    <Form.Label className="text-nowrap me-3 multi-col">
                      Image {index + 1}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    controlId={`formLabel${index}`}
                    className="d-flex align-items-center"
                  >
                    <Form.Control
                      type="text"
                      placeholder={`Label`}
                      value={imageData.label}
                      onChange={(e) => handleLabelChange(index, e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md="auto">
                  <Form.Group
                    controlId={`mainImage${index}`}
                    className="d-flex align-items-center"
                  >
                    <Form.Check
                      type="radio"
                      label="Set as Main Image"
                      name="mainImage"
                      checked={mainImageIndex === index}
                      onChange={() => setMainImageIndex(index)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}

            <Row>
                <Col className="d-flex justify-content-end gap-3 ">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
                </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LensModal;
