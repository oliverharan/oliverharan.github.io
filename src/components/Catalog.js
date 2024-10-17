import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Catalog = () => {
  const [lenses, setLenses] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const lensesCollection = collection(db, 'lenses');

  // Fetch lenses from Firestore
  useEffect(() => {
    const fetchLenses = async () => {
      const data = await getDocs(lensesCollection);
      setLenses(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchLenses();
  }, []);

  // Add lens
  const addLens = async () => {
    if (!image) return;

    const imageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(lensesCollection, {
      name,
      description,
      image: imageUrl,
    });

    setName('');
    setDescription('');
    setImage(null);
  };

  // Delete lens
  const deleteLens = async (id) => {
    await deleteDoc(doc(db, 'lenses', id));
  };

  return (
    <div>
      <h1>Lens Catalog</h1>
      <form onSubmit={(e) => { e.preventDefault(); addLens(); }}>
        <input
          type="text"
          placeholder="Lens Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Add Lens</button>
      </form>

      <h2>Existing Lenses</h2>
      <ul>
        {lenses.map(lens => (
          <li key={lens.id}>
            <h3>{lens.name}</h3>
            <p>{lens.description}</p>
            <img src={lens.image} alt={lens.name} width={100} />
            <button onClick={() => deleteLens(lens.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;
