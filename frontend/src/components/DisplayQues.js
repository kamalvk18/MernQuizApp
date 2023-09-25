import React, { useState, useEffect, useRef } from 'react';
import CenteredBox from './CenteredBox';
import ScreenLoader from './ScreenLoader';
import axios from 'axios'
import { useNavigate,useLocation } from 'react-router-dom';

function DisplayQues() {
  const location=useLocation()
  const navigate=useNavigate()
  if(!location.state){
    location.state = window.history.state
  }
  const data=location.state.quizdata
  const questions=data.questions
  const userdata=location.state.userdata
  const email=userdata.email
  const [quiz,setquiz]=useState({})
  const [loader, showLoader] = useState(false)
  const base_url = 'http://localhost:5000/'

  const backConfirm = async () => {
    window.history.pushState(location.state, "", window.location.href);
  };

  useEffect(() => {
    window.history.pushState(location.state, '', window.location.href);
    window.onpopstate = backConfirm;
    return () => {
      window.onpopstate = null;
    };
  }, []);

  const submitQuiz= async ()=>{
      let c=0
      data.questions.map((item,idx1)=>(
          item.options.forEach((op,idx2)=>{
              if(op.isAnswer && Number(quiz[idx1])===idx2){
                 c+=1
              }
          })
      ))
      try{
        await axios.post(`${base_url}${data.subjectName}/store-result`,{"score": c}, { withCredentials: true });
      } catch(error){
        console.error('Error saving quiz', error.response)
      }
  }

  const onChangeValue=(ques,ans)=>{
    console.log(ques,ans)
    setquiz({...quiz,[Number(ques)]:Number(ans)})
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const originalTime = questions[currentQuestionIndex].timeInSec;
  const savedTimer = parseInt(localStorage.getItem('timerPar'));
  const time = !isNaN(savedTimer) ? savedTimer : originalTime;
  const [timer, setTimer] = useState(time);
  const timerRef = useRef(null)
  
  useEffect(() => {
    timerRef.parent = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
        localStorage.setItem('timerPar', timer.toString());
      } else {
        localStorage.removeItem('timerPar');
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        else{
          showLoader(true)
          submitQuiz()
        }
      }
    }, 1000);
   
    return () => clearInterval(timerRef.parent);
  }, [timer]);

  return (
    <div className="">
      {!loader ? (
        <CenteredBox questionObject={questions[currentQuestionIndex]} qno={currentQuestionIndex} onChangeValue={onChangeValue} timer = {timer}/>
      ): <ScreenLoader email={email}/>}
    </div>
  );
}

export default DisplayQues;
