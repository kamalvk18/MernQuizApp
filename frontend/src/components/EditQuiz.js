import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { Container, Button, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useLocation, useNavigate } from 'react-router-dom'
import { useErrorBoundary } from 'react-error-boundary';

const EditQuiz = () => {
    const [subjectName,setSubjectName]=useState("")
    const [description,setDescription]=useState("")
    const [totalques,setTotalques]=useState([])
    const {showBoundary} = useErrorBoundary();
    const location=useLocation()
    const base_url="http://localhost:5000"
    const data=location.state.userdata
    const email = data.email
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
      navigate('/editques', {state: {subjectName, description, it, data, quiz_id, preserveState: location.state}})
    }

    const deleteQues= async (it)=>{
      try{
        const res = await axios.post(base_url+`/${it._id}/delete/`,{
          quiz_id
        },{ withCredentials: true })
        setTotalques(res.data)
      } catch(err){
        showBoundary(err)
      }
    }

    const addQues=()=>{
      navigate('/addques', {state: {subjectName, description, userdata: data, isEdit: true, quiz_id, preserveState: location.state}})
    }

    const getAnswer = (options)=>{
      const key = options.findIndex((option) => option.isAnswer === true);
      return key+1
    }

    const goBack = () =>{
      navigate('/main')
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
              Key: {getAnswer(it.options)}
            </Card.Text>
            <div class="d-flex gap-1 h-100">
              <Button variant='warning' size='sm' onClick={() => {editQues(it)}}>Edit</Button>
              <Button variant='danger' size='sm' onClick={()=>{deleteQues(it)}}>Delete</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      ))}
      <Button variant='primary' size='sm' onClick={addQues} className='mb-2'>Add</Button>
      <Button variant='outline-success' size='sm' onClick={goBack} className='mb-2 d-block'>Back</Button>
    </Container>
  )
}
export default EditQuiz
