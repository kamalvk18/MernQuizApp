import React, { useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom"
import { Container, Button, Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';
import Error from './Error';
import '../css/Addques.css'

// ques,setques,quesid,userdata,quizdata,isEdit
const Addques = () => {
  const location = useLocation();
  const navigate=useNavigate();
  const [timerEnable,setTimerEnable]=useState(false)
  const {subjectName, description,maxAttempts, deadline, userdata, isEdit, quiz_id, preserveState} = location.state
  const [ques,setques]=useState({1:"",2:"",3:"",4:"",q:"",key:""})
  const [display,setDisplay]=useState(false)
  const [totalques,setTotalques]=useState([])
  const [time, setTime] = useState()
  const [answer, setAnswer] = useState('');
  const [errorMsg, setError] = useState(null);

  const handleSelectChange = (e) => {
    setAnswer(e.target.value);
    if(e.target.value==="Yes"){
      setTimerEnable(true)
    }
    else{
      setTimerEnable(false)
    }
  };
  
  const [validated, setValidated] = useState(false);

  const handleSubmit=async (e,req,res)=>{
    if(ques.q!==""){
      alert("please click add before submit")
    }
    else{
    const questions=[] 
    totalques.map((data)=>{
      const d=data[0];
      const q=d.q
      const indivialques=[]
      indivialques.push(q);
      const options=[]
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

    try {
      const response = await axios.post(base_url+'/addQuiz', {
        quizName:subjectName,
        subjectName,
        description,
        collegeName:userdata.college,
        questions,
        maxAttempts,
        deadline,
        setByTeacher:userdata.email
      },{ withCredentials: true });
      navigate('/main')
  } catch (error) {
    setError(error.response.data.message)
  }}
} 

  const base_url="http://localhost:5000"
  const addQuestion=async (event)=>{
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      event.stopPropagation();
    }
    else{
      setValidated(false);
      if(isEdit===undefined){
        console.log("here in non edit ")
        const data=[...totalques]
        data.push([ques])
        setTotalques(data)
        console.log(totalques)
        setTimeout(()=>{
          setDisplay(true)
        },1000)
        setques({1:"",2:"",3:"",4:"",q:"",key:""})
      }
      else{
        try {
          const response = await axios.post(base_url+'/addques', {
            question:ques.q,
            a:ques[1],
            b:ques[2],
            c:ques[3],
            d:ques[4],
            key:ques.key,
            quiz_id
          }, {withCredentials: true});
          
          if(response.status === 200){
            navigate('/editquiz',
              {state: {editquiz: preserveState.editquiz, userdata: preserveState.userdata}}
            )
          }
        }
        catch(err){
          setError(err.response.data.message)
        }
      }
    }
  }

  return (
    <Container style={{width:'1000px'}}>
      {errorMsg && <Error errorText={errorMsg} setError={setError}/>}
      <div className="custom-card-container">
      <Card className="custom-card">
        <Card.Body className="addquiz-custom-card-body">
          <Card.Title className='card-text'><h3>Quiz: {subjectName}</h3></Card.Title>
          <Card.Text className='card-text'>
            <h5>Description: {description}</h5>
            <h5>Max attempts: {maxAttempts}</h5>
            <h5>Do you want to enable a timer for this quiz: 
              <select value={answer} onChange={handleSelectChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </h5>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
      


      {!isEdit && <div>
        {totalques.length > 0 && <h4>Available questions:</h4>}
        {totalques.map((data,index)=>{
            return(
              <>
                <Card className='mb-1'>
                <Card.Body>
                  <Card.Title>{data[0].q}</Card.Title>
                  <Card.Text>
                    a. {data[0][1]} <br />
                    b. {data[0][2]} <br />
                    c. {data[0][3]} <br />
                    d. {data[0][4]} <br />
                  </Card.Text>
                  <Card.Text>
                    Key: {data[0].key}
                  </Card.Text>
                </Card.Body>
                </Card>
              </>
          )})}
        {display && <Alert key='success' variant='success'>
            Added!
        </Alert>}
      </div>}
      
      <h4>Add question:</h4>

      <Form noValidate validated={validated} onSubmit={addQuestion}>
        <FloatingLabel
          controlId="floatingInput"
          label="Question"
          className="mb-3"
        >
          <Form.Control 
            type="text" 
            placeholder="Enter question" 
            value={ques.q}
            onChange={(e) => setques((prev)=>({...prev,q:e.target.value}))}
            required
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Option A"
          className="mb-1"
        >
          <Form.Control 
            type="text" 
            placeholder="option A" 
            value={ques[1]} 
            onChange={(e) => setques((prev)=>({...prev,1:e.target.value}))}
            required
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Option B"
          className="mb-1"
        >
          <Form.Control 
            type="text"
            placeholder="option B"
            value={ques[2]}
            onChange={(e) => setques((prev)=>({...prev,2:e.target.value}))}
            required
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Option C"
          className="mb-1"
        >
          <Form.Control 
            type="text"
            placeholder="option C"
            value={ques[3]}
            onChange={(e) => setques((prev)=>({...prev,3:e.target.value}))}
            required
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Option D"
          className="mb-1"
        >
          <Form.Control 
            type="text"
            placeholder="option D"
            value={ques[4]}
            onChange={(e) => setques((prev)=>({...prev,4:e.target.value}))}
            required
          />
        </FloatingLabel>
        <Form.Select 
          aria-label="Default select example" 
          className="mb-1" 
          style={{width:'100px'}} 
          value={ques.key}
          onChange={(e) => setques((prev)=>({...prev,key:e.target.value}))}
          required
        >
          <option value="">Key</option>
          <option value="1">A</option>
          <option value="2">B</option>
          <option value="3">C</option>
          <option value="4">D</option>
        </Form.Select>
        {timerEnable?<FloatingLabel
          controlId="floatingInput"
          label="timeInSec"
          className="mb-1"
        >
          <Form.Control 
            type="text"
            placeholder="timeInSec"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />         

        </FloatingLabel>:""}
        <Button type='submit' variant="success" size ="sm" className="mb-2" style={{width: '100px'}}>Add</Button>
      </Form>
      {!isEdit && <div className="d-flex justify-content-end">
        <Button variant="success" onClick={handleSubmit}>Submit</Button>
      </div>}
    </Container>
  )
}

export default Addques
