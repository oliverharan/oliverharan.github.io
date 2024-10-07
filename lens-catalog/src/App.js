import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LensList from './components/LensList';
import LensDetail from './components/LensDetails';

const lenses = [
  { id: '1', name: 'Lens 1', description: 'Details about Lens 1', image: '/path-to-lens1.jpg' },
  { id: '2', name: 'Lens 2', description: 'Details about Lens 2', image: '/path-to-lens2.jpg' },
  // Add more lenses here
];

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LensList lenses={lenses} />} />
        <Route path="/lenses/:lensId" element={<LensDetail lenses={lenses} />} />
      </Routes>
    </Router>
  );
};

export default App;
