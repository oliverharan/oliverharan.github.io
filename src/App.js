import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Container,Button } from 'react-bootstrap';
import Catalog from './components/Catalog';
import AddLens from './components/AddLens';
import LensDetails from './components/LensDetails';
import LensModal from "./components/LensModal";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import './App.css';

const App = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false)
  return (
    <Router>
      <div className="App">
        {/* Bootstrap Navbar */}
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container className="d-flex justify-content-between">
            <Navbar.Brand href="/">Lens Library</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
              <OverlayTrigger
          key="bottom"
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-add-lens`}>
              Add lens
            </Tooltip>
          }
        >
          <Button variant="outline-light" onClick={handleShow} className="circle-btn"><i className="bi bi-plus"></i></Button>
          
        </OverlayTrigger>
          
          <LensModal showModal={showModal} handleClose={handleClose} />

              {/* <Nav.Link as={Link} to="/">Home</Nav.Link> */}
              {/* <Nav.Link as={Link} to="/catalog">Catalog</Nav.Link> */}
              {/* <Nav.Link as={Link} to="/add">Add Lens</Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Define Routes */}
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Catalog />} />
            {/* <Route path="/catalog" element={<Catalog />} /> */}
            <Route path="/add" element={<AddLens />} />
            <Route path="/lens/:id" element={<LensDetails />} /> 
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;
