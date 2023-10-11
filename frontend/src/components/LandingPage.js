import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../css/LandingPage.css';
import { Button } from 'react-bootstrap';  
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Error from './Error';

const BASE_URL = 'http://localhost:5000';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  const quotes = [
    "The secret of getting ahead is getting started - Mark Twain",
    "Knowledge is power - Francis Bacon",
    "Knowledge makes you intelligent, experience makes you wiser - Anonymous", 
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

  const handleLogin = async ({name, email, password}) => {
    try {
      const res = await axios.post(BASE_URL + '/check-user', { email });
      if (res.data.exists) {
        try{
          const resp = await axios.post(BASE_URL + '/login', { email, password }, { withCredentials: true });
          if (resp.status === 200){
            navigate('/main');
          }
        } catch(error){
          setError('Invalid Credentials!')
        }
      } else {
        navigate('/register', { state: { email, msg: 'Looks like you are new here, Please Register!' } });
      }
    } catch (error) {
      setError('Error checking user!')
    }
  }

  const google = async () => {
    window.open("http://localhost:5000/auth/google", "_self");
  }

  return (
    <div className="split-container">
      {errorMsg && <Error errorText={errorMsg} setError={setError}/>}
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
          <Button variant='success' onClick={()=>{ navigate('/register')}}>Get Started</Button>
        </div>
      </div>

      <div className="small-section">
        <div className="brand-logo">
          <div className="brand-name">QuizApp</div>
          <h2>Login in to your account</h2>
          <h4>Don't have an account? <a href='' onClick={()=>{ navigate('/register')}}>Sign Up</a></h4>
        </div>
        
        <button type="button" class="login-with-google-btn" onClick={google}>
          Sign in with Google
        </button>

        <div className="separator">
            <div className="separator-line"></div>
            <div className="separator-text">or</div>
            <div className="separator-line"></div>
          </div>
          <div className="login-form">
        <Form
          noValidate
          validated={validated}
          onSubmit = {(e)=> {
            e.preventDefault()
            const form = e.currentTarget;
            if (form.checkValidity() === false) {
              e.stopPropagation();
            } else {
              handleLogin({email, password})
            }
            setValidated(true);
        }}>
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-2"
          >
            <Form.Control 
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange} 
              placeholder="Email"
              required
            />
          </FloatingLabel>
          <FloatingLabel 
            controlId="floatingPassword" 
            label="Password"
            className="mb-2"
          >
            <Form.Control 
              type="password" 
              value={password} 
              onChange={handlePasswordChange} 
              placeholder="Password"
              required
            />
          </FloatingLabel>
          <div className='d-flex'>
            <Button type="submit" variant="success" className='flex-grow-1'>
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
