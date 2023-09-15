import '../css/CenteredBox.css'; // Import your CSS file
import React, { useState, useEffect } from 'react';

// Custom Timer Component
const Timer = ({ time, isRed }) => (
  <div className={`timer ${isRed ? 'red' : ''}`}>
    <div className={`timer-count ${isRed ? 'shake' : ''}`}>
      {time <= 5 ? (
        <span className="countdown-animation">Time left : {time} S</span>
      ) : (
        <span>Time left : {time} S</span>
      )}
    </div>
  </div>
);

const CenteredBox = ({ questionObject,qno,onChangeValue}) => {
    const question=questionObject.question
  const options=questionObject.options
  const time=questionObject.timeInSec

  const [selectedOption, setSelectedOption] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(time);

  const handleOptionChange =(optionIndex) => {
    setSelectedOption(optionIndex === selectedOption ? null : optionIndex);
    onChangeValue(qno,optionIndex)
    // console.log(selectedOption)
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
      else{
        setTimer(time)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>

    <div className="centered-box">
      <div className="question-card">
        <h2>{question}</h2>
      </div>
      <div className="options-card">
        <div className="options-grid">
          {options.map((option, index) => (
            <div
              key={index}
              className={`option-card ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => handleOptionChange(index)}
            >
              <div className="card-content">
                <h3>{option.option}</h3>
                {selectedOption === option.option && (
                  <div className="cool-graphics">
                    {/* Add your cool graphics here */}
                    <span>🚀</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Timer time={timer} isRed={timer <= 5} />
    </div>
    <div className="action-buttons">
        <button className="btn btn-primary" disabled={isButtonDisabled}>
          Next
        </button>
        <button className="btn btn-primary" disabled={isButtonDisabled}>
          Submit
        </button>
      </div>
    </>
  );
};

export default CenteredBox;
