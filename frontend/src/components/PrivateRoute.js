import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ Component, ...rest }) => {
    const navigate = useNavigate();
    if (Cookies.get('email')){
        return <Component {...rest}/>
    } else {
        navigate('/')
    }
}
export default PrivateRoute;