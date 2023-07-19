import React from 'react'
import { useLocation } from 'react-router-dom'
const DisplayScore = () => {
    const location = useLocation();
    const score=location.state.score
    console.log(location.state)
  return (
    <div>
      Congrats u have secured {score} marks
    </div>
  )
}

export default DisplayScore
