import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import Teacher from './Teacher';
import Student from './Student';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from './Navbar';

const HomePage=()=> {
  const location = useLocation();
  const navigate=useNavigate()
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
      <Navbar name = {userdata.name} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <Container>
      {userdata && userdata.occupation==="teacher" &&  <Teacher userdata={userdata} searchQuery={searchQuery}/>}
      {userdata && userdata.occupation==="student" &&  <Student userdata={userdata} searchQuery={searchQuery}/>}
      {/* {display && <h1>Add quiz </h1> } */}
      {/* u should load all the quizzes which matches with college name  */}
      </Container>
    </div>
  )
}

export default HomePage
