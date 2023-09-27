import React, {  useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Cookies from 'js-cookie';

const RegistrationForm = () => {
  const location = useLocation();
  const data = location.state
  const [name, setName] = useState(Cookies.get('name'))
  const emailCookie = Cookies.get('email');
  const [email, setEmail] = useState(data !== null && data.email !== null? data.email: emailCookie);
  const [college,setCollege]=useState('mvgr');
  const [collegeName,setCollegeName]=useState(college);
  const [phone,setPhone]=useState(9999999999)
  const [occupation,setOccupation]=useState('student')
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const availColleges=["mvgr","anits","gvp","other"]
  const navigate=useNavigate()
  const base_url="http://localhost:5000"
  const [validated, setValidated] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else{
      try {
        const response = await axios.post(base_url+'/signup', {
          name: name,
          email: email,
          password,
          college:college==="other"?collegeName:college,
          phone,
          occupation
        }, {withCredentials: true});

        if(response.status === 200)
          navigate('/main')
      } catch (error) {
          console.error('Error registering user:', error);
          setError('An error occurred while registering the user.');
      }
    }
    setValidated(true);
  };
  
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      {data !== null && data.msg ? (
        <h4>{data.msg}</h4>
      ): (
        <Row>
          <h3>Registration Form</h3>
      </Row>
      )}

      <br />
      <Row style={{width: '30%'}}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Show password"
            onChange={() => setShowPassword(!showPassword)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Phone number</Form.Label>
          <Form.Control type="number" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          <Form.Text className="text-muted">
            We'll never share your number with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCollege">
          <Form.Label>College</Form.Label>
          <Form.Select value={college} onChange={e=>setCollege(e.target.value)}>
            {availColleges.map((option,ind) => (
              <option value={option} key={ind}>{option}</option>
            ))}
          </Form.Select>
        </Form.Group>
        {college==="other" && 
          <Form.Group className="mb-3" controlId="formBasicNumber">
            <Form.Label>Please Enter your college name</Form.Label>
            <Form.Control type="text" placeholder="Enter college name" value={collegeName} onChange={(e) => setCollegeName(e.target.value)}/>
          </Form.Group>
        }
        
        <Form.Group>
        <Form.Label>Occupation</Form.Label>
          <Form.Select value={occupation} onChange={(e) => setOccupation(e.target.value)}>
              <option value={"teacher"} key={0}>Teacher</option>
              <option value={"student"} key={1}>Student</option>
          </Form.Select>
        </Form.Group>
        
        <br/>
        <Button variant="primary" type="submit" className='d-flex mx-auto'>
          Register
        </Button>
        {error && <p> Registration Failed due to {error}</p>}
      </Form>
      </Row>
    </Container>
    );
  };

  export default RegistrationForm;
