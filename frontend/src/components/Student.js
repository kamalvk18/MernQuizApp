import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Student = ({userdata}) => {
  // const [quizdata,setquizdata]=useState([])
    const base_url="http://localhost:5000"
    const attempt=(quizdata)=>{
      // const r=e.target.value
      // console.log(e,"scs")
      navigate('/exam',{state:{quizdata}})
        //redirect to write quiz here 
    }
    const navigate=useNavigate();
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

        {/* {console.log(item,idx,"is this really workihng")} */}
        <h2>{item.subjectName}</h2>
        <h2>{item.description}</h2>
        <button onClick={attempt(item)} >Attempt quiz here</button>
        </div>
        
      ))}
    </div>
  )
}

export default Student
