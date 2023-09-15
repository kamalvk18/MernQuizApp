import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ScreenLoader.css'
const ScreenLoader = ({email}) => {
    const [text,setText]=useState("")
    const navigate=useNavigate()
      useEffect(() =>{
        setTimeout(() => {
            ( navigate("/main", { state: { email } }))
    }, 4000);
    setTimeout(() => {
            setText("Quiz Submitted Successfully")
    }, 3000);
  })
  return (
    <div className="loader-container">
    <div className="loader">
      <div className="loader-circle"></div>
      <div className="loader-tick"></div>
    </div>
    <div className="success-message">{text}</div>
  </div>
  );
};

export default ScreenLoader;
