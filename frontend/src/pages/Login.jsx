import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react'
import { AiFillMessage } from "react-icons/ai";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/UserDataContext';
import { useSnackbar } from 'notistack';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Login = () => {

    const { loginData, setLoginData } = useContext(UserDataContext)
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }



    const handleLogin = async (e) => {

        e.preventDefault()

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email);

        if (!isValid) {
            enqueueSnackbar("please enter a valid email", { variant: "warning" });
            return;
        }

        try {
            const payload = { ...loginData };
            const response = await fetch(`${config.BACKEND_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...payload
                })
            });

            const data = await response.json();

            if (response.status === 200) {

                console.log(loginData)
                console.log(data)
                // console.log(data.data.accessToken)
                localStorage.setItem('token', data.data.accessToken);
                localStorage.setItem('fullName', data.data.user.fullName);
                localStorage.setItem('avatar', data.data.user.avatar);
                localStorage.setItem('username', data.data.user.username);
                localStorage.setItem('id', data.data.user._id);
                enqueueSnackbar("Login successful", { variant: "success" });
                navigate('/')
            }
            else {
                enqueueSnackbar(data.message, {
                    variant: "warning"
                });
            }

        } catch (err) {
            console.error("error while Login", err)
        }
    }




    return (
        <div className='h-screen flex justify-center items-center' id='login-page'>

            <div className='w-[500px] flex flex-col gap-5 shadow-2xl/30 rounded-xl px-8 py-8' style={{}}>
                <div className='flex justify-center flex-col items-center gap-3'>
                    <AiFillMessage color='gray' className='text-3xl' />
                    <h1 className='font-bold text-2xl'>Welcome Back</h1>
                    <p className='text-gray-500'>Sign in to continue to Chat</p>

                </div>

                <div>
                    <form onSubmit={handleLogin} className='flex flex-col gap-5'>
                        <div>
                            <Typography variant='body1'>Email address</Typography>
                            <TextField
                                slotProps={{
                                    input: {
                                        startAdornment: (< InputAdornment position='start'>
                                            <MailOutlineOutlinedIcon />

                                        </InputAdornment>)
                                    }
                                }
                                }
                                type='email'
                                id='email-input'
                                name='email'
                                onChange={handleInputChange}
                                variant='outlined'
                                placeholder='name@example.com'
                                fullWidth
                                required
                            />
                        </div>

                        <div>
                            <Typography variant='body1'>Password</Typography>
                            <TextField
                                slotProps={{
                                    input: {
                                        startAdornment: (< InputAdornment position='start'>
                                            <LockOpenOutlinedIcon />

                                        </InputAdornment>)
                                    }
                                }
                                }
                                type='password'
                                id='password-input'
                                name='password'
                                onChange={handleInputChange}
                                variant='outlined'
                                placeholder='Enter your password'
                                fullWidth
                                required
                            />
                        </div>

                        <Button id='login-button' type='submit' variant='contained' color='primary'>Sign in</Button>

                        <Typography sx={{ textAlign: 'center' }} variant='body2'>Don't have an account? <Link to='/register' className='text-blue-500 cursor-pointer' >Sign up</Link></Typography>

                    </form>
                </div>
            </div >

        </div >
    )
}
