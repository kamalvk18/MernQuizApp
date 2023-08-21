import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import axios from 'axios';

const CustomNavbar = (props) => {
  const base_url = "http://localhost:5000"
  const navigate=useNavigate()
  const name = props.name;

  const logOut = async () =>{
    const res = await axios.get(base_url+"/logout" , { withCredentials: true })
    if (res.status === 200){
      navigate('/')
    }
  }

  return (
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
          <Nav.Link href="#action1" className="text-white">Home</Nav.Link>
        </Nav>
        <Navbar.Text style={{marginRight:'5px'}} className="text-white">
          Hi, {name}!
        </Navbar.Text>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            id = "form-search"
          />
          <Button variant="outline-light" className="text-white">Search</Button>
        </Form>
        <Nav>
        <NavDropdown title={<img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/user--v1.png" alt="user--v1" style={{ filter: 'brightness(0) invert(1)' }}/>} id="basic-nav-dropdown" align="end">
          <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}

export default CustomNavbar;
