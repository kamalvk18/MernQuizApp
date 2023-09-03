import React, { useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom"
import { Container, Button, Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';

// ques,setques,quesid,userdata,quizdata,isEdit
const Addques = ({quesid, isEdit, quizdata}) => {
  const location = useLocation();
  const navigate=useNavigate();
  const {subjectName, description, userdata} = location.state
  const [ques,setques]=useState({1:"",2:"",3:"",4:"",q:"",key:""})
  const [display,setDisplay]=useState(false)
  const [totalques,setTotalques]=useState([])

  const handleSubmit=async (e,req,res)=>{
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

    try {
      const response = await axios.post(base_url+'/addQuiz', {
        subjectName,
        description,
        questions,
        setByTeacher:userdata.email,
        collegeName:userdata.college,
      },{ withCredentials: true });
      console.log(response)
      navigate('/main',{state:{email: userdata.email}})

  }catch (error) {
    console.error('Error saving quiz:', error.message);
  }
} 

  const base_url="http://localhost:5000"
  const addQuestion=async ()=>{
    if(isEdit===undefined){
      console.log("here in non edit ")
      const data=[...totalques]
      data.push([ques])
      setTotalques(data)
      console.log(totalques)
      setTimeout(()=>{
        setDisplay(true)
      },1000)
    }
    else{
      console.log("write logic to edit something",quesid)
      try {
        const response = await axios.post(base_url+'/addques', {
          question:ques.q,
          a:ques[1],
          b:ques[2],
          c:ques[3],
          d:ques[4],
          key:ques.key,
          quiz_id:quizdata._id
        }, {withCredentials: true});
        console.log(response)
    }
      
    catch(err){
      console.log(err)
    }
    finally{
      alert("successfully updated!")
      window.location.reload();
    }
    }
  }

  return (
    <Container style={{width:'1000px'}}>
    <h3>Quiz: {subjectName}</h3>
    <h3>Description: {description}</h3>
    <Form>
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
        />
      </FloatingLabel>
      <Form.Select 
        aria-label="Default select example" 
        className="mb-1" 
        style={{width:'100px'}} 
        value={ques.key}
        onChange={(e) => setques((prev)=>({...prev,key:e.target.value}))}
      >
        <option>Key</option>
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
        <option value="3">D</option>
      </Form.Select>
      <Button variant="outline-primary" onClick={addQuestion} className="mb-2" style={{width: '100px'}}>Add</Button>
      {display && <Alert key='success' variant='success' style={{width: '100px'}}>
          Added!
      </Alert>}
      {totalques.map((data,index)=>{
        return(
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
      )})}
      <div className="d-flex justify-content-end">
        <Button type='submit' variant="success" onClick={handleSubmit}>Submit</Button>
      </div>
    </Form>
    </Container>
  )
}

export default Addques
