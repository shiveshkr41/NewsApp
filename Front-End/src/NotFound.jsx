// NotFound.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; // Assuming you have a CSS file for styling

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000); // Redirect after 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="not-found">
      <img 
        src="https://img.freepik.com/free-vector/404-error-with-portals-concept-illustration_114360-7880.jpg?w=826&t=st=1721297367~exp=1721297967~hmac=313806e96d9989747a0002e3568f8f9c4e9a69d2a12e1aef3ac8a44d7d23ba7d" 
        alt="404 Not Found" 
        className="not-found-image"
      />
      <h1>Page Not Found</h1>
      <p>Redirecting to the home page...</p>
    </div>
  );
};

export default NotFound;
