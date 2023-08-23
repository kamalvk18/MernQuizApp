import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { ButtonGroup } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

function Teacher({userdata, searchQuery}) {
  const base_url="http://localhost:5000"
  const navigate=useNavigate()
  const [quiz,setquiz]=useState([])
  const itemsPerPage = 12; // Number of items to show per page
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = quiz.slice(0, indexOfLastItem);

  const filteredQuizzes = quiz.filter(q =>
    q.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSeeMore = () => {
    setCurrentPage(currentPage + 1);
  };
  const viewDetails=(quizdata)=>{
    navigate('/quiz',{state:{quizdata,userdata}})
  }

  const handleClick = () => {
    navigate('/addquiz', { state: { userdata } });
  };

  useEffect(()=>{
    fetch(base_url+"/quizzes/"+userdata.college)
    .then((res) => res.json())
    .then((json) => {
      // console.log(json)
        setquiz(json)
    })
  },[])
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center p-3 mb-0">
        <h5>Available quizzes by {userdata.college} are: </h5>
        <Button variant="primary" size="sm" onClick={handleClick}>Add Quiz</Button>
      </div>
      <hr />
      <Container>
      <Row xs={1} md={4} className="g-4">
        {(filteredQuizzes || currentItems).map((q,ind)=>(

          <Col key={ind}>
          <Card id="allCards" style={{ width: '18rem' }} className = 'h-100'>
          <Card.Body className="d-flex flex-column">
            <Card.Title>{q.subjectName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Set by: {q.setBy}</Card.Subtitle>
              <Card.Text className="card-text-truncate">
              Description: {q.description}
              </Card.Text>
              
                <div className='mt-auto'>
                  <ButtonGroup className="w-100">
                  <Button variant="outline-primary" size="sm" onClick={()=>viewDetails(q)} className='mt-auto w-100'>View details</Button>
                  </ButtonGroup>
                </div>
              
              </Card.Body>
          </Card>  
          </Col>
        ))}
      </Row>
      <Row>
        <Col className="d-flex justify-content-end mt-3">
          {quiz.length > indexOfLastItem && (
            <Button variant="primary" size="sm" onClick={handleSeeMore}>
              See More
            </Button>
          )}
        </Col>
      </Row>
      </Container>

    </div>
  )
}

export default Teacher
