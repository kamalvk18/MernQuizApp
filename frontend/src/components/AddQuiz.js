import React, { useState } from 'react'
import { useLocation,useNavigate} from "react-router-dom";
import { Container, Button, Form } from 'react-bootstrap';
function Quiz() {
  const navigate=useNavigate();
  const base_url="http://localhost:5000"
  const location=useLocation();
  const userdata=location.state.userdata
  const [subjectName,setSubjectName]=useState("")
  const [description,setDescription]=useState("")
  const handleSubmit=(e,req,res)=>{
    e.preventDefault()
    navigate('/addques', {state: {subjectName, description, userdata}})
} 

return (
    <Container style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', height: '100vh'}}>
      <Form onSubmit={handleSubmit} style={{width: '300px'}}>
        <Form.Group className="mb-3">
          <Form.Label>Quiz name</Form.Label>
          <Form.Control type="text" placeholder="Enter quiz name" value={subjectName} onChange={(e)=>setSubjectName(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Enter description for the quiz" value={description} onChange={(e)=>setDescription(e.target.value)}/>
        </Form.Group>
        <Button type='submit' variant="primary" className="ml-auto">Next</Button>
    </Form>
    </Container>
  )
}

export default Quiz
