import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../css/LandingPage.css';
import { Button } from 'react-bootstrap';  
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import jwtDecode from 'jwt-decode';

const BASE_URL = 'http://localhost:5000';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const quotes = [
    "The secret of getting ahead is getting started - Mark Twain",
    "Knowledge is power - Francis Bacon",
    "Knowledge makes you intelligent; experience makes you wiser - Anonymous", 
    "The expert in anything was once a beginner - Helen Hayes",
    "Learning never exhausts the mind - Leonardo da Vinci",
    "The only way to do great work is to love what you do - Steve Jobs"
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
    }, 3000); // Change quote every 3 seconds

    return () => clearInterval(interval);
  }, []);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const responseGoogle = async (response) => {
    // Decoding the response object
    try {
      if (response.credential != null) {
        const USER_CREDENTIAL = jwtDecode(response.credential);
        const { name, email } = USER_CREDENTIAL;

        // Making post request to check if the user exists
        try {
          const res = await axios.post(BASE_URL + '/check-user', { email });
          if (res.data.exists) {
            const resp = await axios.post(BASE_URL + '/login', { email }, { withCredentials: true });
            navigate('/main', { state: { email } });
          } else {
            navigate('/register', { state: { name, email } });
          }
        } catch (error) {
          console.log('Error checking user:', error);
        }
      } else {
        console.log('Google login failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="split-container">
      <div className="large-section">
        <div className="background-image">
          <img
            src="https://t4.ftcdn.net/jpg/03/03/32/29/240_F_303322991_j4dMRbdkvaTKU8o50FJichVrYEbvjbWJ.jpg"
            alt="Background"
          />
        </div>
        <div className="overlay">
          <div className="Welcome-text mb-2">
            <h2 className="typing-animation">{quotes[quoteIndex]}</h2>
          </div>
          <Button variant='primary'>Get Started</Button>
        </div>
      </div>

      <div className="small-section">
        <div className="brand-logo">
          <div className="brand-name">QuizApp</div>
          <h2>Login in to your account</h2>
          <h4>Don't have an account? <span>Sign Up</span></h4>
        </div>
        <GoogleOAuthProvider clientId="806225457345-dlv6oecjp4db580q4oo8dj0ln8sgte6o.apps.googleusercontent.com">
          <div className="d-flex justify-content-center align-items-center">
            <GoogleLogin
              className="custom-google-login-button"
              buttonText="Sign in with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </GoogleOAuthProvider>
        <div className="separator">
            <div className="separator-line"></div>
            <div className="separator-text">Or with email and password</div>
            <div className="separator-line"></div>
          </div>
          <div className="login-form">
        <Form>
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-2"
          >
            <Form.Control type="email" id="email" value={email} onChange={handleEmailChange} placeholder="Email"/>
          </FloatingLabel>
          <FloatingLabel 
            controlId="floatingPassword" 
            label="Password"
            className="mb-2"
          >
            <Form.Control type="password" value={password} onChange={handlePasswordChange} placeholder="Password"/>
          </FloatingLabel>
          <div className='d-flex'>
            <Button type="submit" variant="primary" className='flex-grow-1'>
              Login
            </Button>
          </div>
        </Form>
      </div>
      </div>
    </div>
  );
};

export default LandingPage;
