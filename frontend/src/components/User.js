import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Cardcomponent from './Cardcomponent';
const User = ({userdata, searchQuery}) => {
    const base_url="http://localhost:5000"
    const navigate=useNavigate()
    const [quiz,setquiz]=useState([])
    const handleClick = () => {
        navigate('/addquiz', { state: { userdata } });
      };
    
    
      useEffect(()=>{
        // console.log(data)
        fetch(base_url+"/quizzes/"+userdata.college)
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            setquiz(json)
        })
      },[userdata.college])
  return (
    <div>
    <div className="d-flex justify-content-between align-items-center p-3 mb-0">
      <h5>Available quizzes by {userdata.college} are: </h5>
      {userdata.occupation==="teacher" && <Button variant="primary" size="sm" onClick={handleClick}>Add Quiz</Button>}
    </div>
    <hr />
   <Cardcomponent  userdata={userdata} searchQuery={searchQuery} quiz={quiz}/>

  </div>
  )
}

export default User