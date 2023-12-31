import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Cardcomponent from './Cardcomponent';
const User = ({userdata, searchQuery}) => {
    const base_url="http://localhost:5000"
    const navigate=useNavigate()
    const [quiz,setquiz]=useState([])
    const college = userdata.college
    const handleClick = () => {
        navigate('/addquiz', { state: { userdata } });
    };

    useEffect(()=>{
      fetch(base_url+"/quizzes/"+college)
      .then((res) => res.json())
      .then((json) => {
          setquiz(json)
      })
    },[college])

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center p-3 pb-0 mb-0">
          <h5>Available quizzes by {userdata.college}   : </h5>
          {userdata.occupation==="teacher" && <Button variant="primary" size="sm" onClick={handleClick}>Add Quiz</Button>}
        </div>
        <hr />
        {/* {console.log(quiz)} */}
        {quiz.length !== 0 ? (
          <Cardcomponent userdata={userdata} searchQuery={searchQuery} quiz={quiz}/>
        ): (
          <p>No quizzes are added by ur college!</p>
        )}
      </div>
  )
}

export default User
