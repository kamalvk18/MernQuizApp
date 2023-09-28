import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { ButtonGroup } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
const Cardcomponent = ({userdata,searchQuery,quiz}) => {
  const navigate=useNavigate()
  const itemsPerPage = 12; // Number of items to show per page
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = quiz.slice(0, indexOfLastItem);
  const handleSeeMore = () => {
    setCurrentPage(currentPage + 1);
  };
  const viewDetails=(quizdata)=>{
    navigate('/quiz',{state:{quizdata,userdata}})
  }

  const filteredQuizzes = quiz.filter(q =>
    searchQuery && q.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quizzesToDisplay = (filteredQuizzes.length !== 0) ? filteredQuizzes : currentItems;

  return (
    <>
      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {(quizzesToDisplay).map((q,ind)=>(
            <Col key={ind}>
            <Card id="allCards" style={{ width: '18rem', borderRadius:'1%' }} className = 'h-100'>
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
              <Button variant="primary" size="sm" onClick={handleSeeMore} className='mb-2'>
                See More
              </Button>
            )}
          </Col>
        </Row>
      </Container> 
    </>
  )
}

export default Cardcomponent
