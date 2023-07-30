import React from 'react'
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
const Addques = ({ques,setques,totalques,setTotalques,setDisplay,quesid,userdata,quizdata,isEdit}) => {
  const base_url="http://localhost:5000"
  // const email=userdata.email
  // const navigate=useNavigate()
    const addQuestion=async ()=>{
        if(isEdit===undefined){
          console.log("here in non edit ")
        const data=[...totalques]
        // console.log(dummy,data)
        data.push([ques])
        // console.log(dummy)
        setTotalques(data)
        console.log(totalques)
        setTimeout(()=>{
          setDisplay("ques Added")
        },2000)
      }
      else{
        console.log("write logic to edit something",quesid)
        try {
          const response = await axios.post(base_url+'/edit/'+quesid, {
            question:ques.q,
            a:ques[1],
            b:ques[2],
            c:ques[3],
            d:ques[4],
            key:ques.key,
            quiz_id:quizdata._id
          });
          console.log(response)
          
      }
      
      catch(err){
        console.log(err)
      }
      finally{
      // console.log("Sdfeswhgdhgvh")
      alert("successfully updated!")
      // console.log(userdata,quizdata)
      window.location.reload();}
      // navigate("/editquiz",{state:{userdata,quizdata}})
    }
  }
  return (
    <div>
       
       Question:<input
        type="text"
        placeholder="enter your question here"
        value={ques.q}
        onChange={(e) => setques((prev)=>({...prev,q:e.target.value}))}
      />
      <br />
      option A:
      <input
        type="text"
        placeholder="option A"
        value={ques[1]}
        onChange={(e) => setques((prev)=>({...prev,1:e.target.value}))}
      />
      <br />
            option B:
      <input
        type="text"
        placeholder="option B"
        value={ques[2]}
        onChange={(e) => setques((prev)=>({...prev,2:e.target.value}))}
      />
      <br />
                  option C:
      <input
        type="text"
        placeholder="option C"
        value={ques[3]}
        onChange={(e) => setques((prev)=>({...prev,3:e.target.value}))}
      />
      <br />
                  option D:
      <input
        type="text"
        placeholder="option D"
        value={ques[4]}
        onChange={(e) => setques((prev)=>({...prev,4:e.target.value}))}
      />
      <br />
                  key:
      <input
        type="text"
        placeholder="1 for option a,2 for option b likewise"
        value={ques.key}
        onChange={(e) => setques((prev)=>({...prev,key:e.target.value}))}
      />
      
      <button type="button" onClick={addQuestion}>Add me </button>
    </div>
  )
}

export default Addques
