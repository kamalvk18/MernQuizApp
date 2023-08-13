import React, { useState } from 'react'
import Addques from './Addques'
import axios from 'axios'; 
import { useLocation,useNavigate} from "react-router-dom";
function Quiz() {
  const navigate=useNavigate();
  const [ques,setques]=useState({1:"",2:"",3:"",4:"",q:"",key:""})
  const base_url="http://localhost:5000"
  const location=useLocation();
  const email=location.state.userdata.email
  const [subjectName,setSubjectName]=useState("")
  const [description,setDescription]=useState("")
  const [display,setDisplay]=useState('')
  const [totalques,setTotalques]=useState([])
  const handleSubmit=async (e,req,res)=>{
    alert('saved successfully')
    e.preventDefault()
    const questions=[]

  
    totalques.map((data)=>{
        const d=data[0];
        const q=d.q
        const indivialques=[]
        indivialques.push(q);
        const options=[]
        console.log(d)
        for(let i=1;i<=4;i++)
        {
          if(Number(d.key)===i){
            options.push({option:d[i],isAnswer:true})
          }
          else
          options.push({option:d[i],isAnswer:false})
        }
        indivialques.push(options)
        questions.push({question:q,options:options})
    })
       
        console.log("doggy",location.state.userdata.college,questions)
        try {
          const response = await axios.post(base_url+'/addQuiz', {
            subjectName,
            description,
            questions,
            setByTeacher:location.state.userdata.email,
            collegeName:location.state.userdata.college,
          },{ withCredentials: true });
          console.log(response)
          navigate('/main',{state:{email}})

  }catch (error) {
    console.error('Error saving quiz:', error.message);
  }
}
  
 


return (
    <div>
  <form onSubmit={handleSubmit}>
    quiz name:
    <input type='text' placeholder='enter the quiz name' value={subjectName} onChange={(e)=>setSubjectName(e.target.value)}/>
    <br />
    description :
    <input type='text' placeholder='enter the description for the quiz' value={description} onChange={(e)=>setDescription(e.target.value)}/>
    <Addques ques={ques} setques={setques} totalques={totalques} setTotalques={setTotalques} setDisplay={setDisplay} /> 
    <button type='submit'>Submit</button>
{/* <button type="button" onClick={addOption}>Add option </button> */}
{/* {} */}
      
      {display}
      {totalques.map((data,index)=>{
        return(
          <div key={index}>
          <h2>ques,: {data[0].q}</h2>
          <h3>option A: {data[0][1]}</h3>
          <h3>option B: {data[0][2]}</h3>
          <h3>option C: {data[0][3]}</h3>
          <h3>option D: {data[0][4]}</h3>
          <h4>key: {data[0].key}</h4>
          </div>
        
        // data
      )})}
      
<br />
</form>
    </div>
  )
}

export default Quiz
