import React, { useState } from "react"
import {useLocation} from "react-router-dom"
import { Button, Container, Form }  from 'react-bootstrap';

const Settings = () =>{
    const location = useLocation();
    const {name, email, college, phone} = location.state
    const [username, setUsername] = useState(name)
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState(phone)

    return(
        <Container style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', height: '100vh'}}>
            <Form style = {{width: '300px'}}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" value={username} onChange={e => setUsername(e.target.value)}/>
                </Form.Group>
        
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}/>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Show password" onChange={() => setShowPassword(!showPassword)}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="number" value={number} onChange={(e) => setNumber(e.target.value)}/>
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
    )

}

export default Settings