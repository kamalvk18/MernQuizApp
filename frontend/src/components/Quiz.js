import React, { useState } from 'react'

function Quiz() {
  const [ques,setques]=useState()
  const [option,setoption]=useState([{a:"",b:"",c:"",d:""}])
  const [totalques,setTotalques]=useState([])
  const handleSubmit=()=>{

  }
  return (
    <div>
      {/* bro continue from here or u can do our own  */}
      {/* what i wanted to do is we should have a button which says add question when it is clicked then only new ques input should be displayed  */}
      {/* suppose atfirst only one input ques1 will be present then if user clicks add ques another ques2 input should be displayed  like wise*/}
      {/* if this works try the same method for adding options as well */}
  <form onSubmit={handleSubmit}>
      
      Question:<input
        type="text"
        placeholder="enter your question here"
        value={ques}
        onChange={(e) => setques(e.target.value)}
      />
      <br />
      option A:
      <input
        type="text"
        placeholder="option A"
        value={option.a}
        onChange={(e) => setoption((prev)=>({...prev,a:e.target.value}))}
      />
            option B:
      <input
        type="text"
        placeholder="option B"
        value={option.b}
        onChange={(e) => setoption((prev)=>({...prev,b:e.target.value}))}
      />
      <button type="button" onClick={()=>setTotalques([ques,option])}>Add me </button>
      {totalques}
      
<br />
</form>
    </div>
  )
}

export default Quiz
