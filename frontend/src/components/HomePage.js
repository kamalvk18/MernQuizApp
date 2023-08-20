import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import Teacher from './Teacher';
import Student from './Student';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const HomePage=()=> {
  const location = useLocation();
  const navigate=useNavigate()
  const data = location.state;
  const [userdata,setUserdata]=useState([])
  const base_url="http://localhost:5000"
  useEffect(()=>{
    fetch(base_url+"/userdata/"+data.email)
    .then((res) => res.json())
    .then((json) => {
        setUserdata(json[0])
    })
  },[])

  const logOut = async () =>{
    const res = await axios.get(base_url+"/logout" , { withCredentials: true })
    if (res.status === 200){
      navigate('/')
    }
  }
  // console.log(userdata)
  return (
    
    <div>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="#">Quiz App</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link href="#action1">Home</Nav.Link>
            </Nav>
            <Navbar.Text style={{marginRight:'5px'}}>
              Hi, {userdata.name}!
            </Navbar.Text>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                id = "form-search"
              />
              <Button variant="outline-light">Search</Button>
            </Form>
            <Nav
              className="me-3 my-2 my-md-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            <NavDropdown title="Settings" id="navbarScrollingDropdown" align='end'>
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5" onClick={logOut}>
                  Logout
                </NavDropdown.Item>
            </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
      {userdata && userdata.occupation==="teacher" &&  <Teacher userdata={userdata}/>}
      {userdata && userdata.occupation==="student" &&  <Student userdata={userdata}/>}
      {/* {display && <h1>Add quiz </h1> } */}
      {/* u should load all the quizzes which matches with college name  */}
      </Container>
    </div>
  )
}

export default HomePage
