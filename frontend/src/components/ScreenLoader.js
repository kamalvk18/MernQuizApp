import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ScreenLoader.css'
const ScreenLoader = ({email, submitQuiz}) => {
  const [text,setText]=useState("")
  const navigate=useNavigate()

  useEffect(() => {
    const submit = setTimeout(() => {
      submitQuiz();
      setText("Quiz Submitted Successfully");
    }, 2000);
    
    return () =>{
      clearTimeout(submit)
    }
  }, []);

  useEffect(() => {
    const navigateToMain = setTimeout(() => {
      navigate("/main");
    }, 3000);
    
    return () =>{
      clearTimeout(navigateToMain)
    }
  }, []);

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
