import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ Component, ...rest }) => {
    const navigate = useNavigate();
    const location = useLocation();
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
            return <Component {...rest}/>
        }else{
            console.log('User not authenticated to redirect to main page')
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