import React, { useState, useEffect } from 'react';
import CenteredBox from './CenteredBox';

function DisplayQues({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      setIsButtonDisabled(true); // Disable buttons for the current question
      // Wait for the specified time for the current question
      const timer = setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsButtonDisabled(false); // Enable buttons for the next question
      }, questions[currentQuestionIndex].timeInSec * 1000);

      // Cleanup the timer when the component unmounts or when the question changes
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questions]);

  return (
    <div className="">
      { console.log(questions,questions[0],"sadsfasdfas")}
      {currentQuestionIndex < questions.length && (
        <CenteredBox questionObject={questions[currentQuestionIndex]} />
      )}
      <div className="action-buttons">
        <button className="btn btn-primary" disabled={isButtonDisabled}>
          Next
        </button>
        <button className="btn btn-primary" disabled={isButtonDisabled}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default DisplayQues;
