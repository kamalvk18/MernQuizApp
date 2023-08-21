import React,{useEffect, useState} from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios'
import Navbar from './Navbar'; // Adjust the import path as needed
import { Table, Card } from 'react-bootstrap';

const DisplayQuiz = () => {
  const base_url="http://localhost:5000/"
  const location = useLocation();
  const quizName = location.state.quizdata.subjectName
  const description = location.state.quizdata.description
  const usermail = location.state.userdata.email
  const username = location.state.userdata.name
  //try to fetch quizname and descriptionn from attribute instead of api
  const [results,setResults]=useState([])
  const [leaderboard,setLeaderboard]=useState([])
  const [showAttemptHistory,setShowAttemptHistory]=useState(false)
  
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
          </tr>
        </thead>
        <tbody>
          {results.map((attempt, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{attempt.marksObtained}</td>
              <td>{attempt.attempt}</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div>
      <Navbar name = {username} />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 text-center mt-5 mb-4">
          <Card className="p-4 shadow">
              <h2>Quiz Details</h2>
              {/* Render quiz details */}
              {quizName && (
                <>
                  <p><strong>Quiz name:</strong> {quizName}</p>
                  <p><strong>Description</strong> {description}</p>
                  <button className="btn btn-primary" onClick={(e)=>setShowAttemptHistory(!showAttemptHistory)}>
                    View Attempt History
                  </button>
                  {showAttemptHistory && renderAttemptHistoryTable()}
                </>
              )}
            </Card>
            {/* Your main content here */}
            {/* For example, the quiz display */}
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
