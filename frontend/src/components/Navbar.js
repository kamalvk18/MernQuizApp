import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';

function CustomNavbar() {
  return (
    <Navbar expand="lg" bg="dark" variant="dark"> {/* Change the background color to dark and use dark variant */}
      <Container fluid>
        <Navbar.Brand href="#" className="text-white">QuizApp</Navbar.Brand> {/* Add text-white class */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" className="text-white">Home</Nav.Link> {/* Add text-white class */}
          </Nav>
          <div className="d-flex">
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            </Form>
            <Button variant="outline-success">Search</Button>
          </div>
          <Nav>
            <NavDropdown title={<img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/user--v1.png" alt="user--v1" style={{ filter: 'brightness(0) invert(1)' }}/>} id="basic-nav-dropdown" align="end">
              <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
