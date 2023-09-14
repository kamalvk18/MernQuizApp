import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Form, Alert } from "react-bootstrap";

const Settings = () => {
  const base_url = "http://localhost:5000";
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email, college, phone } = location.state;
  const [username, setUsername] = useState(name);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState(phone);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  const changeValues = async (e) => {
    const form = e.currentTarget;
    e.preventDefault()
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    else {
      try {
        // Send a POST request to update user settings
        const response = await axios.post(base_url + "/settings/" + email, {
          username,
          pass: password,
          phone,
        });
  
        // Check the response status for success
        if (response.status === 200) {
          // Successfully updated settings, navigate to the main page
          navigate("/main", { state: { email } });
        } else {
          setError("Failed to update settings. Please try again.");
        }
      } catch (err) {
        console.error("Error updating settings:", err);
        setError("Failed to update settings. Please try again.");
      }
    }
    setValidated(true); 
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form noValidate validated={validated} onSubmit={changeValues} style={{ width: "300px" }}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>College</Form.Label>
          <Form.Control value={college} disabled />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Settings;
