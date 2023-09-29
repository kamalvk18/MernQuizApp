import React,{useEffect, useState} from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios'
import Error from './Error';
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'; // Adjust the import path as needed
import { Table, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import '../css/Popup.css'

const DisplayQuiz = () => {
  const base_url="http://localhost:5000/"
  const location = useLocation();
  const navigate=useNavigate()
  const userdata = location.state ? location.state.userdata : null;
  const quizdata = location.state ? location.state.quizdata : null;
  const quiz_id = quizdata ? quizdata._id : null;
  const quizName =quizdata ? quizdata.subjectName:null;
  const description = quizdata ? quizdata.description:null
  const setBy=quizdata ? quizdata.setBy:null
  const usermail = userdata?userdata.email:null
  const username = userdata?userdata.name:null

  //try to fetch quizname and descriptionn from attribute instead of api
  const [results,setResults]=useState([])
  const [leaderboard,setLeaderboard]=useState([])
  const [showAttemptHistory,setShowAttemptHistory]=useState(false)
  const editQuiz=(e) => {
      
    const editquiz=JSON.parse(e.target.value)
    navigate("/editquiz",{state: {userdata, editquiz}})  
  }
  const deleteQuiz= async ()=>{
    try {
      console.log("deleted!")
      await axios.get(`${base_url}delete/${quiz_id}`);
      navigate("/main",{state: {email:setBy}}) 
    }
    catch(err){
      console.log("error:"+ err)
    }
  }

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const continueQuiz = () => {
    navigate("/exam",{state: {userdata, quizdata}})
  }

  const attemptHere=()=>{
    setIsPopupOpen(true)
  }

  const renderPopup = () => {
    if (isPopupOpen){
      return (
        <div className="popup">
          <div className="popup-content">
            <h2 className='text-danger'>Warning</h2>
            <p>Once the quiz is started, <br/> you can't go back or reload the page.</p>
            <p>The quiz will automatically be submitted if you do so.</p>
            <p>Once next is clicked you cannot move back to previous question.</p>
            <p>Do you still want to continue?</p>
            <button className="continueButton" onClick={continueQuiz}>Continue</button>
            <button className="cancelButton" onClick={() => setIsPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      );
    }else{
      return null
    }
  }

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${base_url}${quizName}/getResults`);
        const quizResults = response.data;
        const studentResultsMap = new Map();

        // Filter and keep the highest score for each student
        quizResults.studentResults.forEach(result => {
          if (!studentResultsMap.has(result.studentEmail) || studentResultsMap.get(result.studentEmail).marksObtained < result.marksObtained) {
            studentResultsMap.set(result.studentEmail, result);
          }
        });

        // Convert the Map to an array of values (highest scores)
        const highestScores = Array.from(studentResultsMap.values());
        console.log(highestScores)
        setLeaderboard(highestScores)
        const filteredResults = quizResults.studentResults.filter(
          result => result.studentEmail === usermail
        );
        setResults(filteredResults);

      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchResults();
  }, [quizName]);
  const renderAttemptHistoryTable = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Marks</th>
            <th>Attempt Number</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((attempt, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{attempt.marksObtained}</td>
              <td>{attempt.attempt}</td>
              <td> {new Date(attempt.date).toLocaleDateString('en-GB')}</td>
              <td>{new Date(attempt.date).toLocaleString('en-GB', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })
              }</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div>
      <Navbar name = {username} email={usermail} />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 text-center mt-5 mb-4">
          <Card className="p-4 shadow">
              <h2>Quiz Details</h2>
              {/* Render quiz details */}
              {quizName && (
                <>
                  <p><strong>Quiz name:</strong> {quizName}</p>
                  <p><strong>Description:</strong> {description}</p>
                    {/* <Button variant="outline-warning" className="w-50" size="sm" onClick={editQuiz} value={JSON.stringify(q)}>Edit</Button>
                    <Button variant="outline-danger" className="w-50" size="sm" onClick={editQuiz} value={JSON.stringify(q)}>Delete</Button> */}
                <div style={{ display: 'flex', flexDirection: 'column' , alignItems: 'center' }}>
                    {userdata.occupation === "student" ? (
                      <>
                        <Button variant="success" size = 'sm' className='w-25' onClick={attemptHere}>
                          Attempt here
                        </Button>
                        <Button variant="primary" size = 'sm' className="w-25 mt-2" onClick={(e) => setShowAttemptHistory(!showAttemptHistory)}>
                          View Attempt History
                        </Button>
                        {renderPopup()}
                      </>
                    ) : usermail===setBy && (
                      <>
                        <Button variant="outline-warning" className="w-25 mb-2" size="sm" onClick={editQuiz} value={JSON.stringify(quizdata)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" className="w-25" size="sm" onClick={deleteQuiz} value={JSON.stringify(quizdata)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                  {userdata.occupation === "student" && showAttemptHistory && renderAttemptHistoryTable()}
                </>
              )}
            </Card>

          </div>
          <div className="col-lg-4 text-center mt-4"> {/* Add margin to move it down */}
            <h2>Leaderboard</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Student Email</th>
                  <th>Marks Obtained</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(result => (
                  <tr key={result._id}>
                    <td>{result.studentEmail}</td>
                    <td>{result.marksObtained}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
          </div>
    </div>
  );
}

export default DisplayQuiz;
