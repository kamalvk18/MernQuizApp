import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import Teacher from './Teacher';
import Student from './Student';
const HomePage=()=> {
  const location = useLocation();
  // const navigate=useNavigate()
  const data = location.state;
  const [userdata,setUserdata]=useState([])
  const base_url="http://localhost:5000"
  useEffect(()=>{
    // console.log(data)
    fetch(base_url+"/userdata/"+data.email)
    .then((res) => res.json())
    .then((json) => {
        // console.log(json[0]);
        setUserdata(json[0])
    })
  },[data])
  return (
    <div>
      
      Logged in successfully bro!

      {userdata && userdata.occupation==="teacher" &&  <Teacher userdata={userdata}/>}
      {userdata && userdata.occupation==="student" &&  <Student userdata={userdata}/>}
      {/* {display && <h1>Add quiz </h1> } */}
      {/* u should load all the quizzes which matches with college name  */}
      
    </div>
  )
}

export default HomePage
