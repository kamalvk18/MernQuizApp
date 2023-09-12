import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import User from './User';
import Container from 'react-bootstrap/Container';
import Navbar from './Navbar';

const HomePage=()=> {
  const location = useLocation();
  const data = location.state;
  const [userdata,setUserdata]=useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const base_url="http://localhost:5000"

  useEffect(()=>{
    fetch(base_url+"/userdata/"+data.email)
    .then((res) => res.json())
    .then((json) => {
        setUserdata(json[0])
    })
  },[])
  // console.log(userdata)
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
      {userdata && <User userdata={userdata} searchQuery={searchQuery}/>}
      </Container>
    </div>
  )
}

export default HomePage
