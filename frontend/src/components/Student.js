import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './../index.css'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from 'react-bootstrap';

const Student = ({userdata}) => {
  const [quizdata,setquizzesdata]=useState([])
  const base_url="http://localhost:5000"
  const viewDetails=(quizdata)=>{
    navigate('/quiz',{state:{quizdata,userdata}})
  }
  const navigate=useNavigate();
  const [quizzes,setquizzes]=useState([])
  useEffect(()=>{
      // console.log(data)
      fetch(base_url+"/quizzes/"+userdata.college)
      .then((res) => res.json())
      .then((json) => {
          // console.log(json);
          setquizzes(json)
      })
    },[userdata.college])

      // console.log(data)
      useEffect(() => {
        (async () => {
          const users = await axios.get(base_url+"/get-all-quizzes" , { withCredentials: true });
          console.log(users.data)
          setquizzesdata(users.data.allQuizzes);
        })();
      
          // setquizzes(json)
      },[])
      const getTotalMarks=async (quizname,marks)=>{
        // console.log("gg1")
        // const info=await axios.get(base_url+"/"+quizname+"/getTotalMarks",{withCredentials:true});
        // setMarks(m)
        // setTotal(info.data) 
        // alert("You have secured : "+ marks+"/"+info.data)
      }
        

  return (
    <Container className='mt-4'>
      <Row xs={1} md={4} className="g-4">
        { quizzes.map((q,ind)=>(
            <Col key={ind}>
            <Card id="allCards" style={{ width: '18rem' }} className = 'h-100'>
            <Card.Body className="d-flex flex-column">
              <Card.Title>{q.subjectName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Set by: {q.setBy}</Card.Subtitle>
              <Card.Text className="card-text-truncate">
              Description: {q.description}
              </Card.Text>
            <Button variant="outline-primary" size="sm" onClick={()=>viewDetails(q)} className='mt-auto w-100'>View details</Button>
            </Card.Body>
          </Card>  
          </Col>        
        ))}
      </Row>
   </Container>
  )
}

export default Student
