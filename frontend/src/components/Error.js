import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FallbackProps } from 'react-error-boundary';
import '../css/ErrorComponent.css';

const Error = (FallbackProps) => {
  const {error, resetErrorBoundary} = FallbackProps
  const navigate = useNavigate();

  const navigateToMainPage = () => {
    navigate('/');
  };

  return (
    <div className="error-container">
      <div className="error-message">OOPSY!</div>
      <p>{error.message}</p>
      <button className="mt-4" onClick={resetErrorBoundary}>Reload Page</button>
      <button className="back-button" onClick={navigateToMainPage}>Go Back</button>
    </div>
  );
};

export default Error;
