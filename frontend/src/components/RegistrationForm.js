import React, {  useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const RegistrationForm = () => {
  const location = useLocation();
  const data = location.state;
  const [college,setCollege]=useState('mvgr');
  const [collegeName,setCollegeName]=useState(college);
  const [phone,setPhone]=useState(9999999999)
  const [occupation,setOccupation]=useState('student')
  const [error, setError] = useState('');
  const availColleges=["mvgr","anits","gvp","other"]
  const Navigate=useNavigate()
  const base_url="http://localhost:5000"

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email} = data
    try {
      const response = await axios.post(base_url+'/signup', {
        name: name,
        email: email,
        college:college==="other"?collegeName:college,
        phone,
        occupation
      }, {withCredentials: true});
      console.log(response)
      console.log(college,collegeName,phone,occupation);
      if(response.status === 200)
        Navigate('/main',{state:{email}})
      } catch (error) {
        console.error('Error registering user:', error);
        setError('An error occurred while registering the user.');
      }
  };
  
  return (
    <Container style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', height: '100vh'}}>
      <Row>
        <h3>Registration Form</h3>
      </Row>
      <br />
      <Row>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Phone number</Form.Label>
          <Form.Control type="number" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          <Form.Text className="text-muted">
            We'll never share your number with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Select value={college} onChange={e=>setCollege(e.target.value)}>
            {availColleges.map((option,ind) => (
              <option value={option} key={ind}>{option}</option>
            ))}
          </Form.Select>
          {college==="other" && 
              <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Phone number</Form.Label>
              <Form.Control type="text" placeholder="Enter college name" value={collegeName} onChange={(e) => setCollegeName(e.target.value)}/>
              </Form.Group>
          }
        </Form.Group>
        
        <Form.Select value={occupation} onChange={(e) => setOccupation(e.target.value)}>
            <option value={"teacher"} key={0}>Teacher</option>
            <option value={"student"} key={1}>Student</option>
        </Form.Select>
        
        <br/>
        <Button variant="primary" type="submit">
          Register
        </Button>
        {error && <p> Registration Failed due to {error}</p>}
      </Form>
      </Row>
    </Container>
    );
  };

  export default RegistrationForm;
