import React, { useState } from 'react'
import { useLocation,useNavigate} from "react-router-dom";
import { Container, Button, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";

function Quiz() {
  const navigate=useNavigate();
  const base_url="http://localhost:5000"
  const location=useLocation();
  const userdata=location.state.userdata
  const [subjectName,setSubjectName]=useState("")
  const [description,setDescription]=useState("")
  const [maxAttempts,setMaxAttempts]=useState(1)
  const [deadline, setDeadline] = useState(new Date())
  const [validated, setValidated] = useState(false);

  const handleSubmit=(e,req,res)=>{
    const form = e.currentTarget;
    e.preventDefault()
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      navigate('/addques', {state: {subjectName, description,maxAttempts, deadline, userdata}})
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
            placeholder="Quiz name" 
            value={subjectName} 
            onChange={(e)=>setSubjectName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Description" 
            value={description} 
            onChange={(e)=>setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Max Attempts</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Maximum number of attempts that a student can make" 
            value={maxAttempts} 
            onChange={(e)=>setMaxAttempts(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Deadline</Form.Label>
          <FaCalendarAlt />
          <DatePicker
            showTimeSelect 
            selected={deadline} 
            onChange={(date) => setDeadline(date)}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </Form.Group>
        <Button type='submit' variant="primary" size='sm' className="ml-auto">Next</Button>
      </Form>
    </Container>
  )
}

export default Quiz
