import React, { useContext, useState } from 'react'
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send"
import GroupsIcon from '@mui/icons-material/Groups';
import { UserDataContext } from '../context/UserDataContext';

export const ActiveChat = () => {
    const [joined, setjoined] = useState(true)

    const { channelData } = useContext(UserDataContext)

    const handleSendMessage = (e) => {
    }
    return (
        <div className=" flex-1 bg-white shadow-xl rounded-md">
            <div className="h-[100%] flex flex-col justify-between">
                <div className="flex flex-col">
                    <div className="relative bg-blue-200 p-3 rounded-md flex gap-2 items-center">

                        <div className="rounded-[50%] bg-white w-[3rem] h-[3rem] flex justify-center items-center">
                            <GroupsIcon />
                        </div>

                        <div className="">
                            {channelData.channelName}
                        </div>


                    </div>
                    <div className="bg-green-300 w-full font-medium rounded-b-md text-sm text-white p-2">
                        online: 1 ved
                    </div>
                </div>
                <div className="h-[100%]">
                    chat
                </div>




                {joined ? (<TextField
                    slotProps={{
                        input: {
                            endAdornment: (<InputAdornment position='end'>
                                <div id="send-button" onClick={handleSendMessage} className="bg-blue-300 p-2 rounded cursor-pointer">
                                    <SendIcon sx={{ color: 'white' }} />
                                </div>
                            </InputAdornment>)
                        }
                    }}
                    placeholder='Type your message...'
                />) : (<button className="text-lg font-medium text-white bg-blue-900 rounded-xl px-4 py-3 w-full cursor-pointer self-center">Join </button>)}
            </div>
        </div>
    )
}
