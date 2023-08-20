import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../css/LandingPage.css';
import Particles from "react-tsparticles";
import { Carousel } from 'react-bootstrap';   
import { loadFull } from "tsparticles";
// import Particles from 'react-particles-js';
// import ParticleBackground from './ParticleBackground';
import jwtDecode from 'jwt-decode';

const BASE_URL = 'http://localhost:5000';

const LandingPage = () => {
  const particlesInit = async (main) => {
    console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('')
  // useEffect(() => {
  //   const typingAnimation = document.querySelector('.typing-animation');
  //   const messages = [
  //     'Welcome to the Quiz App.'
  //   ];
  
  //   let messageIndex = 0;
  //   let charIndex = 0;
  //   let isDeleting = false;
  
  //   const typeText = () => {
  //     typingAnimation.textContent = messages[messageIndex].slice(0, charIndex);
  
  //     if (!isDeleting) {
  //       charIndex++;
  //       if (charIndex > messages[messageIndex].length) {
  //         isDeleting = true;
  //         setTimeout(typeText, 2000); // Delay before starting to delete
  //       } else {
  //         setTimeout(typeText, 200); // Typing speed
  //       }
  //     } else {
  //       charIndex--;
  //       if (charIndex < 0) {
  //         isDeleting = false;
  //         messageIndex = (messageIndex + 1) % messages.length;
  //         charIndex = 0; // Reset charIndex to 0 immediately
  //         setTimeout(typeText, 500); // Delay before typing the next message
  //       } else {
  //         setTimeout(typeText, 50); // Deleting speed
  //       }
  //     }
  //   };
  
  //   typeText();
  // }, []);
  
  
  
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
      {/* <Particles
      id="tsparticles"
      init={particlesInit}
      width="100%" // Adjust the width to fit the large section
      height="100%"
      options={{
        
        "particles": {
            "number": {
                "value": 10,
                "density": {
                    "enable": false,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#fff"
            },
            "shape": {
                "type": "star",
                "options": {
                    "sides": 5
                }
            },
            "opacity": {
                "value": 0.8,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 4,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "rotate": {
                "value": 0,
                "random": true,
                "direction": "clockwise",
                "animation": {
                    "enable": true,
                    "speed": 5,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 600,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 2
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": ["grab"]
                },
                "onclick": {
                    "enable": false,
                    "mode": "bubble"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true,
        "background": {
            "color": "#111",
            "image": "",
            "position": "50% 50%",
            "repeat": "no-repeat",
            "size": "cover"
        }
    }}
    /> */}
      
      <div className="large-section">
        
        <div className="background-image">
    <img
      src="https://www.financialwellbeing.ie/wp-content/uploads/2020/06/quiz-2.jpg"
      alt="Background"
    />
  </div>
  <div className="overlay">
  <div className="Welcome-text">
          <h1 className="typing-animation"></h1>
        </div>
    <p>Test your knowledge and have fun!</p>
    <button className="cta-button">Get Started</button>
  </div>
         {/* <div className="carousel-container">
          <div className="carousel-center">
            <Carousel fade interval={3000} className="responsive-carousel">
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/google-quiz.jpg?width=893&height=600&name=google-quiz.jpg"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Slide 1</h3>
                  <p>Some content for Slide 1</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://www.financialwellbeing.ie/wp-content/uploads/2020/06/quiz-2.jpg"
                  alt="Second slide"
                />
                <Carousel.Caption>
                  <h3>Slide 2</h3>
                  <p>Some content for Slide 2</p>
                </Carousel.Caption>
              </Carousel.Item>
              
            </Carousel> 
       </div>
      </div> */}
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
        <form>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className="lgbtn btn btn-primary">
            Login
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default LandingPage;
