import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ErrorComponent.css';

const Error = () => {
  const navigate = useNavigate();

  const navigateToMainPage = () => {
    navigate('/');
  };

  return (
    <div className="error-container">
      <div className="error-message">OOPSY!</div>
      <button className="back-button" onClick={navigateToMainPage}>Click to go back</button>
    </div>
  );
};

export default Error;
