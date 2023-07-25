import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ Component, ...rest }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setAuthStatus] = useState(false)
    useEffect(() => {
        const checkAuthStatus = async () => {
          try {
            const res = await axios.get('http://localhost:5000/check-auth', { withCredentials: true });
            if (res.status === 200) {
                setAuthStatus(true);
            }
          } catch (error) {
                navigate('/')
          }
        };
        checkAuthStatus();
      }, []);
    

    const handleNavigation = () => {
        if (isAuthenticated){
            return <Component/>
        }else{
            return null
        }
    }

    return (
        <div>
            {handleNavigation()}
        </div>
    );
}
export default PrivateRoute;