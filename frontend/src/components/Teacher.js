import React, { useState,useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
function Teacher({userdata}) {
  const base_url="http://localhost:5000"
  const navigate=useNavigate()
  const [quiz,setquiz]=useState([])
  const editQuiz=(e) => {
      
    const editquiz=JSON.parse(e.target.value)
    // console.log("edited",editquiz['subjectName'],editquiz,editquiz.subjectName)
    // console.log("edited",editquiz,Object.entries(editquiz.split(",")[5]))
    navigate("/editquiz",{state: {userdata, editquiz}})  
  }

  
  useEffect(()=>{
    fetch(base_url+"/quizzes/"+userdata.college)
    .then((res) => res.json())
    .then((json) => {
      // console.log(json)
        setquiz(json)
    })
  },[])
  return (
    <div>
      <Link to="/addquiz" state={{userdata}}> add Quiz</Link>
      <hr />
      <h4>Available quizzes by {userdata.college} are: </h4>

      <hr />
      {quiz.map((q,ind)=>(
        <div key={ind}>
          <div>
          
        <h2>quiz name: {q.subjectName}</h2>
        <h2>description: {q.description}</h2>
        {q.setByTeacher===userdata.email?<button onClick={editQuiz} value={JSON.stringify(q)}>Edit This quiz</button>:""}
        <hr/>

        </div>
        {/* {q.isSetbyTeacher} */}
        </div>
      ))}

    </div>
  )
}

export default Teacher
