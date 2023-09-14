import React, { useEffect, useState } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import CenteredBox from './CenteredBox'
import axios from 'axios'
import DisplayQues from './DisplayQues'
const Writequiz = () => {
    const location=useLocation()
    const navigate=useNavigate()
    const data=location.state.quizdata
    const userdata=location.state.userdata
    const email=userdata.email
    const [quiz,setquiz]=useState({})
    const [actual,setActual]=useState({})
    const base_url = 'http://localhost:5000/'
    useEffect(()=>{
        setActual(data.questions)
    },[data])
    // const [total,setTotal]=
    const onChangeValue=(e)=>{

        const targ=e.target.value.split(" ")
        let ques=targ[0]
        let ans=targ[1]
        // console.log(ques,ans)
        setquiz({...quiz,[Number(ques)]:Number(ans)})
    }
    const submitQuiz= async (e)=>{
        e.preventDefault()
        // console.log(quiz)
        let c=0
        actual.map((item,idx1)=>(
            item.options.forEach((op,idx2)=>{
                // console.log(op.isAnswer,Number(quiz[idx1]),Number(quiz[idx1])===idx2,idx1,idx2)
                if(op.isAnswer && Number(quiz[idx1])===idx2){
                  //  console.log("mad king")
                   c+=1
                }
            })
        ))
        try{
          const response = await axios.post(`${base_url}${data.subjectName}/store-result`,{"score": c}, { withCredentials: true });
          // console.log(userdata,"ilv",userdata.email)
          navigate('/main',{state:{email}})
        }catch(error){
          console.error('Error saving quiz', error.response)
        }
        // console.log(c)
    }
    return (
    <div>
        {/* <form onClick={submitQuiz}> */}
        <DisplayQues questions={data.questions}/>
        </div>
        
    // </div>
  )
}

export default Writequiz
