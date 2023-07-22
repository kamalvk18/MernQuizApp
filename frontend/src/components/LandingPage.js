import React from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie';
const BASE_URL = 'http://localhost:5000'

const LandingPage = () => {
  const navigate=useNavigate()
  const responseGoogle = async (response) => {
    // decoding the response object 
    try{
      if (response.credential != null) {
        const USER_CREDENTIAL = jwtDecode(response.credential);
        const {name, email} = USER_CREDENTIAL

        //Making post request to check if the user exists
        try {
          const res = await axios.post(BASE_URL + '/check-user', { email });
          if (res.data.exists){
            const resp = await axios.post(BASE_URL + '/login', { email }, { withCredentials: true });
            navigate('/main',{state:{email}})
          } else {
            navigate('/register',{state: {name, email}})
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
  } 

  return (
    <GoogleOAuthProvider clientId="806225457345-dlv6oecjp4db580q4oo8dj0ln8sgte6o.apps.googleusercontent.com">
      <div>
        <h2>Login</h2>
        <GoogleLogin
          buttonText="Sign in with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LandingPage;
