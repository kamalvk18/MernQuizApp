import React, { useState,useEffect } from 'react'

const Student = ({userdata}) => {
    const base_url="http://localhost:5000"
    const attempt=()=>{
        //redirect to write quiz here 
    }
const [quizzes,setquizzes]=useState([])
    useEffect(()=>{
        // console.log(data)
        fetch(base_url+"/quizzes/"+userdata.college)
        .then((res) => res.json())
        .then((json) => {
            // console.log(json);
            setquizzes(json)
        })
      },[userdata.college])
  return (
    <div>
     { quizzes.map((item,idx)=>(
        <div key={idx}>

        {console.log(item,idx,"is this really workihng")}
        <h2>{item.subjectName}</h2>
        <h2>{item.description}</h2>
        <button onClick={attempt}>Attempt quiz here</button>
        </div>
        
      ))}
    </div>
  )
}

export default Student
