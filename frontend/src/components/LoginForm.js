import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from "react-router-dom";
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('')
  const navigate = useNavigate();
  const base_url="http://localhost:5000"
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(base_url+'/login', {
        email,
        password,
      });

      console.log(response.data.token); // You can store the token in local storage or state for further use
      if(response.data.token){    
        // <Link to="/main">main</Link>
     navigate('/main',{state:{email}})
    }
    } catch (error) {
      setError(error.response.data.message)
      console.error('Error logging in:',email,password, error.response.data.message);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p>Login Failed due to : {error}</p>}
    </form>
    
    </div>
  );
};

export default LoginForm;

