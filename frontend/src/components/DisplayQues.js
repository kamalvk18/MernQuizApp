import React, { useState, useEffect, useRef } from 'react';
import CenteredBox from './CenteredBox';
import ScreenLoader from './ScreenLoader';
import axios from 'axios'
import { useNavigate,useLocation } from 'react-router-dom';

const DisplayQues=()=> {
  const location=useLocation()
  const navigate=useNavigate()
  if(!location.state){
    location.state = window.history.state
  }
  const data=location.state.quizdata
  const questions=data.questions
  
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const originalTime = questions[currentQuestionIndex].timeInSec;
  const [timer, setTimer] = useState(originalTime);
  const timerRef = useRef(null)
  const userdata=location.state.userdata
  const email=userdata.email
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isSubmitButtonDisabled,setIsSubmitButtonDisabled]=useState(true)
  const [quiz,setquiz]=useState({})
  const [loader, showLoader] = useState(false)
  const [isQuizSubmitted, setisQuizSubmitted] = useState(false)
  const base_url = 'http://localhost:5000/'

  useEffect(()=>{
    if(questions.length-1!==currentQuestionIndex){
      setIsNextButtonDisabled(false)
    }
    else{
      setIsNextButtonDisabled(true)
      setIsSubmitButtonDisabled(false)
    }
  },[currentQuestionIndex])
  const loadNextQues=()=>{
    if (currentQuestionIndex < questions.length - 1) {
      const newQuestionIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(newQuestionIndex);
      setTimer(questions[newQuestionIndex].timeInSec)
      
    }
    else{
      showLoader(true)
      submitQuiz()
    }
  }
  useEffect(() => {
    const showLoaderValue = localStorage.getItem('showLoader');
  
    if (showLoaderValue === 'true') {
      localStorage.removeItem('showLoader');
      submitQuiz()
      showLoader(true);
    }
  }, []);
  
  const backConfirm = async () => {
    window.history.pushState(location.state, "", window.location.href);
  };

  useEffect(() => {
    window.history.pushState(location.state, "", window.location.href);
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

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      localStorage.setItem('showLoader', 'true');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const onChangeValue=(ques,ans)=>{
    setquiz({...quiz,[Number(ques)]:Number(ans)})
  }


  
  useEffect(() => {
    timerRef.parent = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        loadNextQues()
      }
    }, 1000);
   
    return () => clearInterval(timerRef.parent);
  }, [timer]);

  return (
    <div className="">
      {!loader ? (
        <CenteredBox questionObject={questions[currentQuestionIndex]} qno={currentQuestionIndex} onChangeValue={onChangeValue} timer = {timer} isNextButtonDisabled={isNextButtonDisabled} isSubmitButtonDisabled={isSubmitButtonDisabled} loadNextQues={loadNextQues} />
      ): <ScreenLoader email={email}/>}
    </div>
  );
}

export default DisplayQues;
