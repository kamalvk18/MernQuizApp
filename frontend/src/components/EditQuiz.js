import React,{useEffect, useState} from 'react'
import Addques from './Addques'
import { useLocation } from 'react-router-dom'
const EditQuiz = () => {
    const [ques,setques]=useState({1:"",2:"",3:"",4:"",q:"",key:""})
    const [subjectName,setSubjectName]=useState("")
    const [description,setDescription]=useState("")
    const [display,setDisplay]=useState('')
    const [totalques,setTotalques]=useState([])
    const location=useLocation()
    const data=location.state.userdata
    const quiz=location.state.editquiz
    useEffect(()=>{
        setSubjectName(quiz.subjectName)
        setTotalques(quiz.questions)
        setDescription(quiz.description)

        console.log(quiz,"eee")
    },[])
  return (
    <div>
        {/* {console.log("velyundo00")} */}
      <h4>Edit quiz</h4>
      {console.log(data,"edit",quiz.subjectName)}

      {/* {quiz.map((q,i)=>(
        <h1>{q}</h1>
      ))} */}
      <h2>SUbject name: {subjectName}</h2>
      <h2>description: {description}</h2>
      <Addques ques={ques} setques={setques} totalques={totalques} setTotalques={setTotalques} setDisplay={setDisplay}/>
      <h3>{totalques.map((it,index)=>(
      <div>
        <h2>{it.question}</h2>
        {it.options.map((op,s)=>(
           <h4>{op.option}</h4>
        ))}
        </div>
    
      ))}</h3>
    </div>
  )
}

export default EditQuiz
