import React from 'react'
import { Link } from 'react-router-dom'
function Teacher({userdata}) {
  return (
    <div>
      <Link to="/addquiz" state={{userdata}}> add Quiz</Link>
    </div>
  )
}

export default Teacher
