import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LensList from './components/LensList';
import LensDetails from './components/LensDetails';
import LensForm from './components/LensForm';
import EditLens from './components/EditLens';
import Callback from './components/Callback';
import axios from 'axios';

function App() {
  const [lenses, setLenses] = useState([]); // Ensure lenses is initialized as an array

  // Fetch lenses from the API on initial load
  useEffect(() => {
    const fetchLenses = async () => {
      try {
        const response = await axios.get('https://lens-api-7hy7.onrender.com/lenses');
        // Ensure that we're setting lenses to an array, handle response appropriately
        if (Array.isArray(response.data)) {
          setLenses(response.data);  // Assuming the API returns an array of lenses
        } else {
          console.error('Expected an array of lenses:', response.data);
        }
      } catch (error) {
        console.error('Error fetching lenses:', error);
      }
    };
    fetchLenses();
  }, []);

  // Function to add a new lens (POST request)
  const addLens = async (newLens) => {
    try {
      const response = await axios.post('https://lens-api-7hy7.onrender.com/lenses', newLens);
      // Ensure the response is correct before updating the state
      if (response.data && typeof response.data === 'object') {
        setLenses(prevLenses => [...prevLenses, response.data]);  // Append new lens
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error adding lens:', error);
    }
  };

  // Function to edit an existing lens (PUT request)
  const editLens = async (updatedLens) => {
    try {
      await axios.put(`https://lens-api-7hy7.onrender.com/lenses/${updatedLens.id}`, updatedLens);
      setLenses(prevLenses => prevLenses.map(lens => lens.id === updatedLens.id ? updatedLens : lens));
    } catch (error) {
      console.error('Error editing lens:', error);
    }
  };

  // Function to delete a lens (DELETE request)
  const deleteLens = async (id) => {
    try {
      await axios.delete(`https://lens-api-7hy7.onrender.com/lenses/${id}`);
      setLenses(prevLenses => prevLenses.filter(lens => lens.id !== id));
    } catch (error) {
      console.error('Error deleting lens:', error);
    }
  };

  return (
    <Router>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route
            path="/"
            element={<LensList lenses={lenses} deleteLens={deleteLens} />}
          />
          <Route
            path="/add"
            element={<LensForm addLens={addLens} />}
          />
          <Route
            path="/lens/:id"
            element={<LensDetails lenses={lenses} editLens={editLens} deleteLens={deleteLens} />}
          />
          <Route
            path="/edit/:id"
            element={<EditLens lenses={lenses} editLens={editLens} />}
          />
          <Route path="/callback" element={<Callback />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;


/*

Great! Now you can get started with the API!
For public read-only and anonymous resources, such as getting image info, looking up user comments, etc. all you need to do is send an authorization header with your client_id in your requests. This also works if you'd like to upload images anonymously (without the image being tied to an account), or if you'd like to create an anonymous album. This lets us know which application is accessing the API.

Authorization: Client-ID YOUR_CLIENT_ID

For accessing a user's account, please visit the OAuth2 section of the docs.

Client ID:
03d2cb14afd640e
Client secret:
14c4e7378149c2689d181e58a76d438780932fad
Love Imgur? Join our team! · about · store · help · blog · request deletion · terms · privacy · ccpa · apps · api · advertise · ad choices


AND 2nd is Photo Library Anon which is being used

Great! Now you can get started with the API!
For public read-only and anonymous resources, such as getting image info, looking up user comments, etc. all you need to do is send an authorization header with your client_id in your requests. This also works if you'd like to upload images anonymously (without the image being tied to an account), or if you'd like to create an anonymous album. This lets us know which application is accessing the API.

Authorization: Client-ID YOUR_CLIENT_ID

For accessing a user's account, please visit the OAuth2 section of the docs.

Client ID:
131a16b091d6516
Client secret:
a0ab5deac68f80743a65e069fd4b8ee642157f2b
token
http://localhost/callback#access_token=ba4a8a58d053c11b87dd402d9d9e3ab9cd2612af&expires_in=315360000&token_type=bearer&refresh_token=dcc0826dd7b4e52dbc44b4dbb5a6e70a8de37c67&account_username=oharan&account_id=13417621

*/