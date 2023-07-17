import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college,setCollege]=useState('mvgr');
  const [collegeName,setCollegeName]=useState(college);
  const [phone,setPhone]=useState(99999999999)
  const [occupation,setOccupation]=useState('student')
  const [error, setError] = useState('');
  const availColleges=["mvgr","anits","gvp","other"]
  const Navigate=useNavigate()
  const base_url="http://localhost:5000"
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(base_url+'/signup', {
        name,
        email,
        password,
        college:college==="other"?collegeName:college,
        phone,
        occupation
      });
  
      console.log(name,email,password,college,collegeName,phone,occupation,response.data.token);
      if(response.data.token)
      Navigate('/main',{state:{email}})
    } catch (error) {
      console.error('Error registering user:', error);
      setError('An error occurred while registering the user.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      
      Name:<input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      email:
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
<br />
      Password:
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      College:
          <select value={college} onChange={e=>setCollege(e.target.value)}>

{availColleges.map((option,ind) => (

  <option value={option} key={ind}>{option}</option>

))}

</select>
     <br />
     {college==="other" && 
     <div>
           collegeName:<input
           type="text"
           placeholder="enter your college name:"
           value={collegeName}
           onChange={(e) => setCollegeName(e.target.value)}
         />
         </div>
}
     
     <br />
     Phone number:
      <input
        type="number"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
     < br/>
      Occupation:
          <select value={occupation} onChange={(e) => setOccupation(e.target.value)}>


  <option value={"teacher"} key={0}>Teacher</option>
  <option value={"student"} key={1}>Student</option>
</select>
<br />
      <button type="submit">Register</button>
      {error && <p> Registration Failed due to {error}</p>}
    </form>
  );
};

export default RegistrationForm;
