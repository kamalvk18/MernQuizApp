import React, { useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom"
import { Container, Button, Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Error from './Error'

const Editques = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [errorMsg, setError] = useState(null);
    const {subjectName, description, it, data, quiz_id, preserveState} = location.state
    const email = data.email
    const key = it.options.findIndex((option) => option.isAnswer === true);
    const [ques, setques] = useState({1:it.options[0].option,
                                      2:it.options[1].option,
                                      3:it.options[2].option,
                                      4:it.options[3].option,
                                      q:it.question,
                                      key: key+1})

    const base_url="http://localhost:5000"
    const editQuestion = async (quesid) => {
        try {
            const response = await axios.post(`${base_url}/${quesid}/edit/`, {
                question: ques.q,
                a: ques[1],
                b: ques[2],
                c: ques[3],
                d: ques[4],
                key: ques.key,
                quiz_id,
            },{ withCredentials: true });
            navigate('/editquiz',{state:{editquiz: preserveState.editquiz, userdata: preserveState.userdata}})
        }catch (error) {
            setError(error.response.data.message)
        }
    }

    const goBack = () =>{
        navigate('/editquiz',{state:{editquiz: preserveState.editquiz, userdata: preserveState.userdata}})
    }
    
    return(
        <Container style={{width:'1000px'}}>
            {errorMsg && <Error errorText={errorMsg} setError={setError}/>}
            <div className='text-center'>
                <h3>Quiz: {subjectName}</h3>
                <h3>Description: {description}</h3>
            </div>
            <Form>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Question"
                    className="mb-3"
                >
                    <Form.Control 
                    type="text" 
                    placeholder="Enter question" 
                    value={ques.q}
                    onChange={(e) => setques((prev)=>({...prev,q:e.target.value}))}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Option A"
                    className="mb-1"
                >
                    <Form.Control 
                    type="text" 
                    placeholder="option A" 
                    value={ques[1]} 
                    onChange={(e) => setques((prev)=>({...prev,1:e.target.value}))}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Option B"
                    className="mb-1"
                >
                    <Form.Control 
                    type="text"
                    placeholder="option B"
                    value={ques[2]}
                    onChange={(e) => setques((prev)=>({...prev,2:e.target.value}))}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Option C"
                    className="mb-1"
                >
                    <Form.Control 
                    type="text"
                    placeholder="option C"
                    value={ques[3]}
                    onChange={(e) => setques((prev)=>({...prev,3:e.target.value}))}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Option D"
                    className="mb-1"
                >
                    <Form.Control 
                    type="text"
                    placeholder="option D"
                    value={ques[4]}
                    onChange={(e) => setques((prev)=>({...prev,4:e.target.value}))}
                    />
                </FloatingLabel>
                <Form.Select 
                    aria-label="Default select example" 
                    className="mb-1" 
                    style={{width:'100px'}} 
                    value={ques.key}
                    onChange={(e) => setques((prev)=>({...prev,key:e.target.value}))}
                >
                    <option>Key</option>
                    <option value="1">A</option>
                    <option value="2">B</option>
                    <option value="3">C</option>
                    <option value="4">D</option>
                </Form.Select>
                <Button variant="primary" onClick={() => {editQuestion(it._id)}} size='sm' className='mb-2' style={{width: '100px'}}>Submit</Button>
            </Form>
            <Button variant='outline-success' size='sm' onClick={goBack} className='mb-2 d-block'>Back</Button>
        </Container>
    )
}

export default Editques;