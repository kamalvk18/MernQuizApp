import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import Teacher from './Teacher';
import Student from './Student';
import axios from 'axios';

const HomePage=()=> {
  const location = useLocation();
  const navigate=useNavigate()
  const data = location.state;
  const [userdata,setUserdata]=useState([])
  const base_url="http://localhost:5000"
  useEffect(()=>{
    fetch(base_url+"/userdata/"+data.email)
    .then((res) => res.json())
    .then((json) => {
        setUserdata(json[0])
    })
  },[data])

  const logOut = async () =>{
    const res = await axios.get(base_url+"/logout" , { withCredentials: true })
    if (res.status === 200){
      navigate('/')
    }
  }
  console.log(userdata)
  return (
    <div>
      
      Hi {userdata.name}, Logged in successfully!
      <button onClick={logOut}>Logout</button>
      {userdata && userdata.occupation==="teacher" &&  <Teacher userdata={userdata}/>}
      {userdata && userdata.occupation==="student" &&  <Student userdata={userdata}/>}
      {/* {display && <h1>Add quiz </h1> } */}
      {/* u should load all the quizzes which matches with college name  */}
      
    </div>
  )
}

export default HomePage
