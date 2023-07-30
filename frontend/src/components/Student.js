import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './../index.css'
import axios from 'axios';

const Student = ({userdata}) => {
  const [quizdata,setquizzesdata]=useState([])
    const base_url="http://localhost:5000"
    // const [total,setTotal]=useState(0)
    // const [marks,setMarks]=useState(0)
    // const [key,setKey]=useState('')
    const attempt=(quizdata)=>{
      // console.log(userdata,"haskhuak")
      navigate('/exam',{state:{quizdata,userdata}})
        //redirect to write quiz here 
    }
    const navigate=useNavigate();
const [quizzes,setquizzes]=useState([])
// const [display,setDisplay]=useState({})
    useEffect(()=>{
        // console.log(data)
        fetch(base_url+"/quizzes/"+userdata.college)
        .then((res) => res.json())
        .then((json) => {
            // console.log(json);
            setquizzes(json)
        })
      },[userdata.college])
 
        // console.log(data)
        useEffect(() => {
          (async () => {
            const users = await axios.get(base_url+"/get-all-quizzes" , { withCredentials: true });
            setquizzesdata(users.data.allQuizzes);
          })();
        
            // setquizzes(json)
        },[])
        const getTotalMarks=async (quizname,marks)=>{
          console.log("gg1")
          const info=await axios.get(base_url+"/"+quizname+"/get-results",{withCredentials:true});
          // setMarks(m)
          // setTotal(info.data) 
          alert("You have secured : "+ marks+"/"+info.data)
          // const k=
          // m+=1;
          // const k=quizname+m;
          // setKey(quizname+m)
          // setDisplay({...display,[key]:true})
          // console.log(display,display[key])
        }
        

  return (
    <div>
     { quizzes.map((item,idx)=>(
        <div key={idx} className='available-quizes'>

        {/* {console.log(item,idx,"is this really workihng")} */}
        <h2>{item.subjectName}</h2>
        <h2>{item.description}</h2>
        <button onClick={()=>attempt(item)} >Attempt quiz here</button>
        </div>
        
      ))}
      <hr />
      <h5>Attempted quiz Results are:</h5>
      {quizdata.map((item,ind)=>(
        <div key={ind} className='attempted-quizes'>
        <h2 >{item.quizName}</h2>
        <h3>attempt : {item.attempt}</h3>
        {/* {const k=item.quizname+item.attempt} */}
        <button onClick={()=>{getTotalMarks(item.quizName,item.marksObtained)}}>Click for Marks</button>
       {/* { getTotalMarks(item.quizName,item.marksObtained)} */}
        {/* {getTotalMarks(item.quizName)} */}
        {/* {console.log(quizzes)} */}
        {/* {quizzes.map((q,z)=>{
          
          if(q.subjectName===item.quizName){
            setTotal(q.totalMarks)
          }
})} */}

    {/* <h3>Score: {marks}/{total}</h3> */}
        </div>
      ))}
    </div>
  )
}

export default Student
