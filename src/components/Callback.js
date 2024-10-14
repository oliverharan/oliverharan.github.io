import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.slice(1)); // Remove the `#`
      const accessToken = params.get('access_token');
      if (accessToken) {
        localStorage.setItem('imgur_access_token', accessToken);
        navigate('/'); // Navigate to the desired page
      } else {
        console.error('No access token found in the callback URL.');
      }
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
