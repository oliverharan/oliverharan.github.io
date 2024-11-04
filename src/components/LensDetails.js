import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase'; // Ensure you export your storage from your firebase.js
import { Card, Button, Container, Form, Row, Col } from "react-bootstrap";


const LensDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lens, setLens] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLens, setEditedLens] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]); // State to manage multiple images
  const [imageLabels, setImageLabels] = useState({}); // State to manage image labels
  const [mainImage, setMainImage] = useState(''); // State for the main image
  const [links, setLinks] = useState([{label: "", url: ""}]);
  const [category, setCategory] = useState([{category: ''}]);

  useEffect(() => {
    const fetchLens = async () => {
      const lensDoc = await getDoc(doc(db, 'lenses', id));
      if (lensDoc.exists()) {
        const lensData = { id: lensDoc.id, ...lensDoc.data() };
        console.log('lensData', lensData)
        setLens(lensData);
        setEditedLens(lensData);
        setImages(lensData.images || []);
        setMainImage(lensData.mainImage || ''); // Initialize main image
        // Initialize labels if they exist
        setImageLabels(lensData.imageLabels || {});
        setLinks(lensData.links && lensData.links.length > 0 ? lensData.links : [{ label: "", url: "" }]);
        setCategory(lensData.category || []);
      }
    };
    fetchLens();
  }, [id]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLens((prevLens) => ({
      ...prevLens,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const saveChanges = async () => {
    const lensRef = doc(db, 'lenses', id);

    // Update lens data
    await updateDoc(lensRef, {
      ...editedLens,
      mainImage, // Include the main image in the update
      imageLabels, // Include labels for the images
      links,
      category,
    });

    setLens({ ...editedLens, mainImage, imageLabels, links, category });
    setEditedLens({ ...editedLens, mainImage, imageLabels, links, category });
    setIsEditing(false);
    setImageFile(null); // Reset the image file
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `lenses/${id}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const addImage = async () => {
    if (!imageFile) return;
    const imageUrl = await uploadImage(imageFile);
    const newImage = { url: imageUrl, label: '' }; // Include label here
    setImages(prevImages => [...prevImages, newImage]);
  setEditedLens(prevLens => ({
    ...prevLens,
    images: [...prevLens.images, newImage],
  }));
  setImageFile(null);
  };

  const deleteLens = async () => {
    await deleteDoc(doc(db, 'lenses', id));
    navigate('/'); // Redirect back to catalog after deletion
  };

  const deleteImage = async (imageUrl) => {
    const imageRef = ref(storage, imageUrl); // Get reference to the image
    await deleteObject(imageRef); // Delete image from storage

    // Update Firestore
    const updatedImages = images.filter((img) => img.url !== imageUrl);
    setImages(updatedImages); // Update local state
    setEditedLens((prevLens) => ({
      ...prevLens,
      images: updatedImages,
    }));

    // If the deleted image was the main image, reset mainImage
    if (mainImage === imageUrl) {
      setMainImage(updatedImages[0]?.url || ''); // Set the first image as main if exists
    }
  };

  const handleLabelChange = (index, label) => {
    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, label } : img
    );
    setImages(updatedImages);
    setEditedLens(prevLens => ({
      ...prevLens,
      images: updatedImages,
    }));
  };

  const handleMainImageSelect = (imageUrl) => {
    setMainImage(imageUrl); // Set selected image as main image
  };

    // Add new category field
    const addCategoryField = () => {
      setCategory([...category, {category: ''}]);
    };
    
    // Update link input values
    const handleCategoryChange = (index, field, value) => {
      const newCategory = [...category];
      newCategory[index][field] = value || ''; // Update the correct field
      setCategory(newCategory);
  };

  const deleteCategory = (index) => {
    setCategory(category.filter((_, i) => i !== index));
  }

    // Add new link field
    const addLinkField = () => {
      setLinks([...links, {label: '', url: ''}]);
    };

    // Update link input values
    const handleLinkChange = (index, field, value) => {
      const newLinks = [...links];
      newLinks[index][field] = value || ''; // Update the correct field
      setLinks(newLinks);
  };

    const deleteLink = (index) => {
      setLinks(links.filter((_, i) => i !== index));
    }


  if (!lens) {
    return <p>Loading...</p>;
  }

  return (
    <Container className='edit-lens-details'>
      <Card className="my-4 lens-details-card">
        <Card.Body>
          <Card.Title>
              
            {isEditing ? (
              <>
              <Row>
                <Col>
                <Form.Group
                  controlId="formDescription"
                  className="mb-3 d-flex align-items-center"
                >
                <Form.Label className="text-nowrap me-3">
              Title
            </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editedLens.title}
                onChange={handleInputChange}
              />

                </Form.Group>
                </Col>
              </Row>
              </>
            ) : (
              lens.title
            )}
          </Card.Title>

          {isEditing ? (
            <Form>
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
                    value={editedLens.formDescription}
                    onChange={handleInputChange}
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
                    value={editedLens.formManufacturer}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
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
                    value={editedLens.lensMount}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
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
                    value={editedLens.lensFormat}
                    onChange={handleInputChange}
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
                    value={editedLens.focusType}
                    onChange={handleInputChange}
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
                      type="text"
                      name="filterSize"
                      value={editedLens.filterSize}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      className="lens-modal-checkbox ms-3"
                      type="checkbox"
                      name="filterUV"
                      checked={!!editedLens.filterUV}
                      onChange={(e) =>
                        setEditedLens((prevLens) => ({
                          ...prevLens,
                          filterUV: e.target.checked,
                        }))
                      }
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
                    value={editedLens.minAperture}
                    onChange={handleInputChange}
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
                    value={editedLens.maxAperture}
                    onChange={handleInputChange}
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
                    value={editedLens.minFocalLength}
                    onChange={handleInputChange}
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
                    value={editedLens.maxFocalLength}
                    onChange={handleInputChange}
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
                    value={editedLens.imageStabilization}
                    onChange={handleInputChange}
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
                    value={editedLens.diaphragmBlades}
                    onChange={handleInputChange}
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
                    value={editedLens.angleOfView}
                    onChange={handleInputChange}
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
                    value={editedLens.minFocusDistance}
                    onChange={handleInputChange}
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
                    value={editedLens.maxMagnification}
                    onChange={handleInputChange}
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
                    value={editedLens.opticalDesign}
                    onChange={handleInputChange}
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
                    value={editedLens.dimensions}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="formDimensions"
                  className="mb-3 d-flex align-items-center"
                >
                  <Form.Label className="text-nowrap me-3">
                  Max Extension
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="maxExtension"
                    value={editedLens.maxExtension}
                    onChange={handleInputChange}
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
                    value={editedLens.weight}
                    onChange={handleInputChange}
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

    {category.map((category, index) => (
      <Row key={index} className="mb-3">
        <Col className="d-flex">
          <Form.Group
            controlId={`formCategory${index}`}
            className="d-flex align-items-center flex-grow-1"
          >
            <Form.Label className="text-nowrap me-3">Category</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Category Tag ${index + 1}`}
              value={category.category}
              onChange={(e) => handleCategoryChange(index, 'category', e.target.value)}
            />
            <Button variant='danger' onClick={() => deleteCategory(index)} className="ms-3">
              Delete
            </Button>
          </Form.Group>
        </Col>
      </Row>
    ))}
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
          <Form.Group
            controlId={`formLink${index}`}
            className="me-3 d-flex align-items-center flex-grow-1"
          >
            <Form.Label className="text-nowrap me-3">Link</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Link URL ${index + 1}`}
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            />
            <Form.Label className="text-nowrap mx-3">Label</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Link Label ${index + 1}`}
              value={link.label}
              onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
            />
            <Button variant='danger' onClick={() => deleteLink(index)} className="ms-3">
              Delete
            </Button>
          </Form.Group>
        </Col>
      </Row>
    ))}

              <Form.Group>
                <Form.Label>Images</Form.Label>
                <div className='mb-3'>
                  {images.map((image, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <img src={image.url} alt={`Lens ${index}`} style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
                      <Form.Control
                        type="text"
                        placeholder="Label"
                        value={image.label || ''}
                        onChange={(e) => handleLabelChange(index, e.target.value)} // Pass index
                        className="me-2"
                      />
                      <Button variant="danger" onClick={() => deleteImage(image.url)}>
                        Delete
                      </Button>
                      <Button
                        variant={mainImage === image.url ? 'success' : 'outline-secondary'}
                        onClick={() => handleMainImageSelect(image.url)}
                        className="ms-3"
                      >
                        {mainImage === image.url ? 'Main Image' : 'Set as Main'}
                      </Button>
                    </div>
                  ))}
                  <Row>
                  <Col className='flex-grow-1' md="auto">
                    <Form.Control type="file" onChange={handleImageChange} className="mt-3" />
                  </Col>
                  <Col md="auto">
                  <Button variant="primary" onClick={addImage} className="mt-3">
                    Add Image
                  </Button>
                  </Col>
                  </Row>
                </div>
              </Form.Group>
            </Form>
          ) : (
            <div className='details'>
              <Row>
              <Col>
                  <Form.Label className="text-nowrap me-3">
                    Title
                  </Form.Label>
                  <Form.Text>{editedLens.title}</Form.Text>
              </Col>
            </Row>
             <Row className='mb-3'>
              <Col md="auto" className='pe-0'>
                  <Form.Label className="text-nowrap">
                    Description
                  </Form.Label>
                  </Col>
                  <Col>
                  <Form.Text>{lens.formDescription}</Form.Text>
              </Col>
            </Row>
            <Row>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Manufacturer
                  </Form.Label>
                  <Form.Text>{lens.formManufacturer}</Form.Text>
              </Col>
              </Row>
              <Row>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Lens Mount
                  </Form.Label>
                  <Form.Text>{lens.lensMount}</Form.Text>
              </Col>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Lens Format
                  </Form.Label>
                  <Form.Text>
                  {lens.lensFormat}
                  </Form.Text>
              </Col>
            </Row>
            <Row>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Focus Type
                  </Form.Label>
                  <Form.Text>
                  {lens.focusType}
                  </Form.Text>
              </Col>
              <Col>
                <Form.Label className="text-nowrap me-3">
                      Filter Size
                    </Form.Label>
                    <Form.Text>
                    {lens.filterSize}
                    </Form.Text>
                    <Form.Check
                      className="lens-modal-checkbox ms-3"
                      type="checkbox"
                      name="filterUV"
                      label="Has UV"
                      checked={!!lens.filterUV}
                      readOnly
                    />
              </Col>
            </Row>

            <Row>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Min Aperture
                  </Form.Label>
                  <Form.Text>
                  {lens.minAperture}
                  </Form.Text>
              </Col>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Max Aperture
                  </Form.Label>
                  <Form.Text>
                  {lens.maxAperture}
                  </Form.Text>
              </Col>
            </Row>

            <Row>
            <Col>
              <Form.Label className="text-nowrap me-3">
                    Min Focal Length
                  </Form.Label>
                  <Form.Text>
                  {lens.minFocalLength}
                  </Form.Text>
              </Col>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Max Focal Length
                  </Form.Label>
                  <Form.Text>
                  {lens.maxFocalLength}
                  </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Image Stabilization
                  </Form.Label>
                  <Form.Text>
                  {lens.imageStabilization}
                  </Form.Text>
              </Col>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Diaphragm Blades
                  </Form.Label>
                  <Form.Text>
                  {lens.diaphragmBlades}
                  </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Angle of View
                  </Form.Label>
                  <Form.Text>
                  {lens.angleOfView}
                  </Form.Text>
              </Col>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Min Focus Distance
                  </Form.Label>
                  <Form.Text>
                  {lens.minFocusDistance}
                  </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Max Magnification
                  </Form.Label>
                  <Form.Text>
                  {lens.maxMagnification}
                  </Form.Text>
              </Col>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Optical Design
                  </Form.Label>
                  <Form.Text>
                  {lens.opticalDesign}
                  </Form.Text>
              </Col>
            </Row>
            <Row>
              <Col>
              <Form.Label className="text-nowrap me-3">
                    Dimensions
                  </Form.Label>
                  <Form.Text>
                  {lens.dimensions}
                  </Form.Text>
              </Col>
              <Col>
              <Form.Label className="text-nowrap me-3">Weight</Form.Label>
                  <Form.Text>
                  {lens.weight}
                  </Form.Text>
              </Col>
            </Row>
            <Row>
              <Col md="auto">
              <Form.Label className="text-nowrap mr-3">Category</Form.Label>
</Col>
            {Array.isArray(category) && category.length > 0 ? (
              category.map((cat, index) => (
                  <Col key={index} className="d-flex" md="auto">
          {cat.category}
                  </Col>
              ))
              ): null
            }
            </Row>

            {Array.isArray(links) && links.length > 0 ? (
              links
              .filter(link => link.label && link.url)
              .map((link, index) => (
                <Row key={index}>
                  <Col className="d-flex">
                  <Form.Label className="text-nowrap me-3">{link.label}&nbsp;
          <a href={link.url} target="_blank" rel="noopener noreferrer">link</a>
        </Form.Label>
                  </Col>
                </Row>
              ))
    ): null
  }
                  <Row className="d-flex align-items-center">
                  <Col className='d-flex flex-grow-0 align-items-center'>
                      <Form.Label>Main Image</Form.Label>
                      </Col>
                      <Col className='d-flex flex-grow-0 align-items-center'>
              <img src={mainImage} alt="Main Lens" className='mxdd-3' style={{ width: '100px', height: 'auto' }} />
                      </Col>
                  </Row>
                  <Form.Group>
  <Row className="d-flex align-items-center my-4">
  <Col className='d-flex flex-grow-0 align-items-center'>
  <Form.Label>Images</Form.Label>
  </Col>
  {images.length > 0 ? (
    images.map((image, index) => (
        <Col key={index} className='d-flex flex-grow-0'>
          <Form.Text>
            {imageLabels[image.url] || ''}
          </Form.Text>
          <img 
            src={image.url} 
            alt={`Lens ${index}`} 
            style={{ width: '100px', height: 'auto',}} 
          />
        </Col>
    ))
  ) : (
    <Form.Text>No images available.</Form.Text>
  )}
      </Row>
</Form.Group>
            </div>
          )}

          <Row className='justify-content-end'>
          <Col md="auto" className='px-0'>
          <Button variant="danger" onClick={deleteLens}>
            Delete
          </Button>
          </Col>
          <Col md="auto" className='ps-3'>
          <Button variant="primary" onClick={isEditing ? saveChanges : toggleEdit}>
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
          </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LensDetail;
