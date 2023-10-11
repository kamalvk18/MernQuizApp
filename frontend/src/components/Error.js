import React from 'react';
import { Button } from 'react-bootstrap';
import '../css/Popup.css'

const Error = ({errorText, setError, isWarning}) => {
  return (
    <div className="popup">
        <div className="popup-content">
        {!isWarning? <h2>Error!</h2>:
        <h2>Warning!</h2>}
        <p>{errorText}</p>
        <Button variant="danger" size ="sm" onClick={() => setError(null)}>Close</Button>
        </div>
    </div>
  );
}

export default Error;