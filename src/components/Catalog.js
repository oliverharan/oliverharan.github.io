import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Modal,
  Badge
} from "react-bootstrap";

const Catalog = () => {
  const [lenses, setLenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("formManufacturer");
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const lensesCollection = collection(db, "lenses");

  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lensToDeleteId, setLensToDeleteId] = useState(null);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (id) => {
    setLensToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteLens = () => {
    if (lensToDeleteId) {
      deleteLens(lensToDeleteId);
      setLensToDeleteId(null);
      handleCloseDeleteModal();
    }
  };

  // Fetch lenses from Firestore
  useEffect(() => {
    const fetchLenses = async () => {
      const data = await getDocs(lensesCollection);
      const lensesData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLenses(lensesData);
    };
    fetchLenses();
  }, [lensesCollection]);

  const filteredLenses = useMemo(() => {
    return lenses.filter((lens) => {
      let matchesSearchTerm = searchTerm
        ? lens.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      let matchesFilter = selectedValue
        ? lens[selectedFilter] === selectedValue
        : true;
      let matchesCategory = selectedCategory
        ? lens.category && lens.category.some((cat) => cat.category === selectedCategory)
        : true;
      return matchesSearchTerm && matchesFilter && matchesCategory;
    });
  }, [lenses, searchTerm, selectedFilter, selectedValue, selectedCategory]);

  // Delete lens
  const deleteLens = async (id) => {
    await deleteDoc(doc(db, "lenses", id));
  };

  const uniqueCategories = Array.from(
    new Set(
      lenses.flatMap((lens) =>
        lens.category ? lens.category.map((cat) => cat.category) : []
      )
    )
  );
  // Get unique values for the selected filter
  const uniqueValues = (field) => {
    return [...new Set(lenses.map((lens) => lens[field]))];
  };

  const formManufacturers = uniqueValues("formManufacturer");
  const focusType = uniqueValues("focusType"); // Example: Add more fields as needed

  const filterOptions = [
    { label: "Manufacturer", value: "formManufacturer", options: formManufacturers },
    { label: "Type", value: "focusType", options: focusType },
  ];

  return (
    <>
      <Container className="lens-catalog">
        <Row>
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <h1>Lens Catalog</h1>
        </div>
        </Row>

        {/* Search and Filter Controls */}
        <Form.Group controlId="search" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search lenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="filterSelect" className="mb-3">
              <Form.Select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="valueSelect" className="mb-3">
              <Form.Select
                value={selectedValue || ""}
                onChange={(e) => setSelectedValue(e.target.value || null)}
              >
                <option value="">--Select an option--</option>
                {filterOptions
                  .find((option) => option.value === selectedFilter)
                  ?.options.map((optionValue, index) => (
                    <option key={index} value={optionValue}>
                      {optionValue}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
            {/* Category Badges */}
        <div className="mb-3">
          {uniqueCategories.map((category, index) => (
            <Badge
              key={index}
              onClick={() => setSelectedCategory(category)}
              className="me-2"
              bg={category === selectedCategory ? "primary" : "secondary"}
              style={{ cursor: "pointer" }}
            >
              {category}
            </Badge>
          ))}
          {selectedCategory && (
            <Badge
              onClick={() => setSelectedCategory(null)}
              bg="danger"
              style={{ cursor: "pointer", marginLeft: "10px" }}
            >
              Clear Category Filter
            </Badge>
          )}
        </div>
        </Row>

        {/* Display Filtered Lenses */}
        <Row>
          {filteredLenses.length > 0 ? (
            filteredLenses.map((lens) => (
                <React.Fragment key={lens.id}>
                {/* Lens Card */}
                <Col md={4} key={lens.id} className="mb-4">
                  <Card
                    onClick={() => navigate(`/lens/${lens.id}`)}
                    style={{ cursor: "pointer" }}
                    className="position-relative card"
                  >
                    <Card.Title className="justify-content-end m-0">
                    <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowDeleteModal(lens.id);
                          }}
                          className="delete-button"
                        >
                          <i className="bi bi-x-lg"></i>
                        </Button>
                  </Card.Title>

                    <Card.Body>
                    {lens.lensMount === "F" && (
          <img
            src="/images/nikon_logo.svg"
            alt="Nikon Logo"
            className="card-icon-nikon"
          />
        )}
        {lens.lensMount === "X" && (
          <img
            src="/images/fuji_logo.svg"
            alt="Fuji Logo"
            className="card-icon-fuji"
            />
        )}
        {lens.lensMount === "M42" && (
          <div className="card-icon-m42">M42</div>
        )}
                      <img src={lens.mainImage} alt={lens.name} width={100} />
                    </Card.Body>
                  </Card>
                  <Card.Title className="d-flex justify-content-center mt-3 text-center">
                    {lens.title}
                  </Card.Title>
                </Col>

                {/* Delete Lens Modal  */}
                <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirm delete</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Are you show you want to delete </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleCloseDeleteModal}
                    >
                      Close
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {handleDeleteLens()}}
                    >
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>
              </React.Fragment>
            ))
          ) : (
            <p>No lenses found.</p>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Catalog;
