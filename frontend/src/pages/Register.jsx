import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useContext } from 'react'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { CiAt } from "react-icons/ci";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { AiFillMessage } from 'react-icons/ai';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserDataContext';
import { useSnackbar } from 'notistack';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
// import { set } from 'firebase/database';
import { useState } from 'react';


export const Register = () => {

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    const { userData, setUserData } = useContext(UserDataContext);

    const handleInputChange = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    };


    const handleRegistration = async (e) => {
        e.preventDefault();

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email);

        if (!isValid) {
            enqueueSnackbar("please enter a valid email", { variant: "warning" });
            return;
        }

        try {
            const payload = { ...userData };
            const response = await fetch(`${config.BACKEND_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...payload
                })
            });

            const data = await response.json();

            if (response.status === 201) {

                console.log(userData)
                console.log(data)
                enqueueSnackbar("Registration successful", { variant: "success" });
                navigate('/login')
            }
            else {
                enqueueSnackbar(data.message, {
                    variant: "warning"
                });
            }

        } catch (err) {
            console.error("error while registration", err)
        }
    }

    return (
        <div className='h-screen flex justify-center items-center' id='register-page'>

            <div className='w-[500px] flex flex-col gap-5 shadow-2xl/30 rounded-xl px-8 py-8' style={{}}>
                <div className='flex justify-center flex-col items-center gap-3'>
                    <AiFillMessage color='gray' className='text-3xl' />
                    <h1 className='font-bold text-2xl'>Create Account</h1>
                    <p className='text-gray-500'>Join our community and start chatting</p>

                </div>

                <div>
                    <form onSubmit={handleRegistration} className='flex flex-col gap-5'>
                        <div>
                            <Typography variant='body1'>Full Name</Typography>
                            <TextField
                                slotProps={{
                                    input: {
                                        startAdornment: (< InputAdornment position='start'>
                                            <PersonOutlinedIcon />

                                        </InputAdornment>)
                                    }
                                }
                                }
                                id='fullname-input'
                                value={userData.fullName}
                                onChange={handleInputChange}
                                variant='outlined'
                                name='fullName'
                                placeholder='Your full name'
                                fullWidth
                                required
                            />
                        </div>

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
                                id='email-input'
                                value={userData.email}
                                onChange={handleInputChange}
                                name='email'
                                variant='outlined'
                                placeholder='name@example.com'
                                fullWidth
                                required
                            />
                        </div>

                        <div>
                            <Typography variant='body1'>Username</Typography>
                            <TextField
                                slotProps={{
                                    input: {
                                        startAdornment: (< InputAdornment position='start'>
                                            <CiAt />

                                        </InputAdornment>)
                                    }
                                }
                                }
                                id='username-input'
                                value={userData.username}
                                onChange={handleInputChange}
                                name='username'
                                variant='outlined'
                                placeholder='Choose a username'
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
                                id='password-input'
                                type='password'
                                variant='outlined'
                                value={userData.password}
                                onChange={handleInputChange}
                                name='password'
                                placeholder='Choose a strong password'
                                fullWidth
                                required
                            />
                        </div>

                        <Button id='register-button' type='submit' variant='contained' color='primary'>Create Account</Button>

                        <Typography sx={{ textAlign: 'center' }} variant='body2'>Already have an accout? <Link to='/login' className='text-blue-500 cursor-pointer' >Sign in</Link></Typography>

                    </form>
                </div>
            </div >
        </div >
    )
}
