import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { Container, Button, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useLocation, useNavigate } from 'react-router-dom'

const EditQuiz = () => {
    const [subjectName,setSubjectName]=useState("")
    const [description,setDescription]=useState("")
    const [totalques,setTotalques]=useState([])
    const location=useLocation()
    const base_url="http://localhost:5000"
    const data=location.state.userdata
    const quiz=location.state.editquiz
    const quiz_id=quiz._id
    const navigate=useNavigate();
    useEffect(() => {
      (async () => {
        const quizes = await axios.get(base_url+"/get/"+ quiz_id);
        // setquizzesdata(users);
        const quiz=quizes.data
        setSubjectName(quiz.subjectName)
        setTotalques(quiz.questions)
        setDescription(quiz.description)
      })();
    
        // setquizzes(json)
    },[])

    const editQues=(it)=>{
        // setDescription("worked bro"  )
        // console.log(options[0].option,q)
        // const v={1:options[0].option,2:options[1].option,3:options[2].option,4:options[3].option,q:q,key:options[0].isAnswer?1:options[1].isAnswer?2:options[2].isAnswer?3:options[3].isAnswer?4:5}
        // console.log(v)
        // setQuesid(question_id)
        // setques(v)
        navigate('/editques', {state: {subjectName, description, it, data, quiz_id}})

    }
  return (
    <Container style={{width:'1000px'}}>
        {/* {console.log("velyundo00")} */}
      <h3 style={{textAlign: 'center'}}>Edit quiz</h3>
      <h4>Quiz: {subjectName}</h4>
      <h4>Description: {description}</h4>
      {totalques.map((it,index)=>(
        <Card className='mb-1'>
        <Card.Body>
          <Card.Title>{index+1}. {it.question}</Card.Title>
          <Card.Text>
            a. {it.options[0].option} <br />
            b. {it.options[1].option} <br />
            c. {it.options[2].option} <br />
            d. {it.options[3].option} <br />
          </Card.Text>
          <div className='d-flex justify-content-between'>
            <Card.Text>
              Key: {it.key}
            </Card.Text>
            <div class="d-flex gap-1 h-100">
              <Button variant='warning' size='sm' onClick={() => {editQues(it)}}>Edit</Button>
              <Button variant='danger' size='sm'>Delete</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      ))}
    </Container>
  )
}

export default EditQuiz
