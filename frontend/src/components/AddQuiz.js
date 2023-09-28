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
  const [maxAttempts,setMaxAttempts]=useState(1)
  const [validated, setValidated] = useState(false);

  const handleSubmit=(e,req,res)=>{
    const form = e.currentTarget;
    e.preventDefault()
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      navigate('/addques', {state: {subjectName, description,maxAttempts, userdata}})
    }
    setValidated(true); 
  }

return (
    <Container style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', height: '100vh'}}>
      <Form noValidate validated={validated} onSubmit={handleSubmit} style={{width: '300px'}}>
        <Form.Group className="mb-3">
          <Form.Label>Quiz name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter quiz name" 
            value={subjectName} 
            onChange={(e)=>setSubjectName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter description for the quiz" 
            value={description} 
            onChange={(e)=>setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Max Attempts</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter the maximum number of attempts that a student can make" 
            value={maxAttempts} 
            onChange={(e)=>setMaxAttempts(e.target.value)}
            required
          />
        </Form.Group>
        <Button type='submit' variant="primary" className="ml-auto">Next</Button>
      </Form>
    </Container>
  )
}

export default Quiz
