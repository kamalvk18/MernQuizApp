import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import User from './User';
import Container from 'react-bootstrap/Container';
import Navbar from './Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import Error from './Error';

const HomePage=()=> {
  const location = useLocation();
  const data = location.state; 
  const email = Cookies.get('email');
  const [userdata,setUserdata]=useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setError] = useState(null);
  const base_url="http://localhost:5000"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${base_url}/userdata/${email}`);
        setUserdata(response.data[0]);
      } catch (error) {
        setError(error.response.data.message)
        // Retry fetching after 2 seconds if there's some error fetching data.
        setTimeout(fetchData, 2000);
      }
    };
  
    fetchData();
  }, [email]);

  return (
    
    <div>
      <Navbar name = {userdata.name}
              email={userdata.email}
              college = {userdata.college} 
              phone = {userdata.phone}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isHome={true}
      />
      <Container>
        {errorMsg && <Error errorText={errorMsg} setError={setError}/>}
        {userdata !== null ? (
          <User userdata={userdata} searchQuery={searchQuery} />
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </div>
  )
}

export default HomePage
