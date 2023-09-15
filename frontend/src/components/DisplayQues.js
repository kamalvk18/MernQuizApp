import React, { useState, useEffect } from 'react';
import CenteredBox from './CenteredBox';
import ScreenLoader from './ScreenLoader';
import axios from 'axios'
import { useNavigate,useLocation } from 'react-router-dom';

function DisplayQues() {
  const location=useLocation()
  const navigate=useNavigate()
  
  const data=location.state.quizdata
  const questions=data.questions
  const userdata=location.state.userdata
  const email=userdata.email
  const [quiz,setquiz]=useState({})
  const [actual,setActual]=useState({})
  const base_url = 'http://localhost:5000/'
  useEffect(()=>{
      setActual(data.questions)
  },[data])
  const submitQuiz= async ()=>{
      // e.preventDefault()
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
        // navigate('/main',{state:{email}})
      }catch(error){
        console.error('Error saving quiz', error.response)
      }
      // console.log(c)
  }
  const onChangeValue=(ques,ans)=>{
    console.log(ques,ans)
    setquiz({...quiz,[Number(ques)]:Number(ans)})
}
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      // setIsButtonDisabled(true); // Disable buttons for the current question
      // Wait for the specified time for the current question
      const timer = setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // setIsButtonDisabled(false); // Enable buttons for the next question
      }, questions[currentQuestionIndex].timeInSec * 1000);

      // Cleanup the timer when the component unmounts or when the question changes
      return () => clearTimeout(timer);
    }
    else{
      console.log(quiz)
      submitQuiz()
    }
   
  }, [currentQuestionIndex, questions]);

  return (
    <div className="">
      {currentQuestionIndex < questions.length ? (
        <CenteredBox questionObject={questions[currentQuestionIndex]} qno={currentQuestionIndex} onChangeValue={onChangeValue} />
      ):   (<ScreenLoader email={email}/>) }
    </div>
  );
}

export default DisplayQues;
