import React,{useEffect, useState} from 'react'
import Addques from './Addques'
import axios from 'axios'




import { useLocation } from 'react-router-dom'
const EditQuiz = () => {

    const [ques,setques]=useState({1:"",2:"",3:"",4:"",q:"",key:""})
    const [quesid,setQuesid]=useState()
    const [subjectName,setSubjectName]=useState("")
    const [description,setDescription]=useState("")
    const [display,setDisplay]=useState('')
    const [totalques,setTotalques]=useState([])
    const location=useLocation()
    const base_url="http://localhost:5000"
    const data=location.state.userdata
    const quiz=location.state.editquiz
    const quiz_id=quiz._id
    useEffect(() => {
      (async () => {
        const quizes = await axios.get(base_url+"/get/"+ quiz_id);
        // setquizzesdata(users);
        const quiz=quizes.data
        setSubjectName(quiz.subjectName)
        setTotalques(quiz.questions)
        setDescription(quiz.description)
        console.log("gg",quiz)
      })();
    
        // setquizzes(json)
    },[])

    const editQues=(question_id,q,options)=>{
        // setDescription("worked bro"  )
        console.log(options[0].option,q)
        const v={1:options[0].option,2:options[1].option,3:options[2].option,4:options[3].option,q:q,key:options[0].isAnswer?1:options[1].isAnswer?2:options[2].isAnswer?3:options[3].isAnswer?4:5}
        console.log(v)
        setQuesid(question_id)
        setques(v)
    }
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
      <Addques ques={ques} setques={setques} totalques={totalques} setTotalques={setTotalques} setDisplay={setDisplay} quesid={quesid} userdata={data} quizdata={quiz}isEdit/>
      <h3>{totalques.map((it,index)=>(
      <div>
        <h2 key={index}>{index+1}){it.question}</h2>
        <button onClick={()=>{editQues(it._id,it.question,it.options)}}>Edit me</button>
        {it.options.map((op,s)=>(
           <div key={s}>

           <h4 >{op.option}</h4>
           {/* {op.isAnswer && <h3>Key: {s+1}</h3>} */}
           </div>
        ))}

        </div>
    
      ))}</h3>
    </div>
  )
}

export default EditQuiz
