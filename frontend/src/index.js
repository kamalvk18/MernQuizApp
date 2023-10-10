import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from "react-error-boundary"
import Error from './components/Error';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={Error}
      onError={()=>console.log('Error occurred!')}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
