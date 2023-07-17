import React from 'react'
import { Link } from "react-router-dom";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function LandingPage() {
  return (
    <div>
      <Link to="/register">Register</Link>
<hr />

            <Link to="/login">Login</Link>
  
    </div>
  )
}

export default LandingPage
