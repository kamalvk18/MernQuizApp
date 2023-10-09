import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import User from './User';
import Container from 'react-bootstrap/Container';
import Navbar from './Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useErrorBoundary } from 'react-error-boundary';

const HomePage=()=> {
  const location = useLocation();
  const {showBoundary} = useErrorBoundary();
  const data = location.state; 
  const email = Cookies.get('email');
  const [userdata,setUserdata]=useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const base_url="http://localhost:5000"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${base_url}/userdata/${email}`);
        setUserdata(response.data[0]);
      } catch (error) {
        showBoundary(err)
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
