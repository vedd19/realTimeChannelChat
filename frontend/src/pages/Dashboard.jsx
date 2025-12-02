import React, { useContext, useState } from "react";

import { CreateChannelBtn } from "../components/CreateChannelBtn";

import { UserDataContext } from "../context/UserDataContext";
import { ActiveChat } from "../components/ActiveChat";

export const Dashboard = () => {


    const { myChannels, setMyChannels, allChannels, channelData, setChannelData, joinedChannels, setJoined, joined } = useContext(UserDataContext)

    const channelClickHandler = async (ele) => {
        console.log(joined, "joined")
        setChannelData(ele)
        for (const channel of joinedChannels) {
            if (channel.channelName === ele.channelName) {
                console.log(true);
                setJoined(true);
                break;
            } else {
                setJoined(false);
            }
        }


        console.log(joined, "joined")
    }

    return (
        <div className="h-screen bg-[#f8f8f8] flex gap-4 flex-col md:flex-row p-4">


            <div className="bg-blue-200 p-4 shadow-md rounded-md w-full md:w-[20%] h-[20%] md:h-full">
                <h2 className='text-blue-900 text-xl font-semibold'>Chat</h2>
                <CreateChannelBtn />


                <div className="flex flex-col gap-3">
                    <h2 className="text-gray-700 border-b-1 pb-1">channels </h2>
                    {/* {console.log(allChannels.data)} */}
                    {allChannels === null ? (
                        <div>Loading...</div>
                    ) : allChannels.length > 0 ? (
                        allChannels.map((ele) => (

                            <div key={ele._id}
                                onClick={() => channelClickHandler(ele)}
                                className="cursor-pointer rounded-md bg-blue-400 px-3 py-2 text-center text-white font-semibold">
                                {ele.channelName}
                            </div>
                        ))
                    ) : (
                        <div>No Channels found</div>
                    )}
                </div>

            </div>

            {channelData ? <ActiveChat /> : <div className=" flex-1 h-[100%] bg-white shadow-xl rounded-md">
                {/* <div className="h-[100%] flex flex-col justify-between">  */}
                Select a channel or create one
                {/* </div> */}
            </div>}




        </div >
    );
};
