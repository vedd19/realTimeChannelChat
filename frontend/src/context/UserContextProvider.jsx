import React, { useState } from 'react'
import { UserDataContext } from './UserDataContext'
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// import { config } from '../src/config';

export const UserContextProvider = ({ children }) => {


    const [userData, setUserData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: ''
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })






    return (
        <UserDataContext.Provider value={{ userData, setUserData, loginData, setLoginData }} >
            {children}
        </UserDataContext.Provider>
    )
}

export default UserContextProvider;

