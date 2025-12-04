import React from 'react';
import { CreateChannelBtn } from './CreateChannelBtn';
import GroupsIcon from '@mui/icons-material/Groups';

export const Sidebar = ({ channelClickHandler, allChannels }) => {

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-5 shadow-2xl rounded-lg w-full h-full flex flex-col text-white overflow-y-auto">

            <div className="mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{localStorage.getItem('fullName')?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <p className="text-gray-300 text-xs uppercase tracking-wide">Logged in as</p>
                        <p className="text-white font-semibold text-sm truncate">{localStorage.getItem('fullName')}</p>
                    </div>
                </div>
            </div>


            <div className="mb-6">
                <CreateChannelBtn />
            </div>


            <div className="flex-1 flex flex-col">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GroupsIcon sx={{ fontSize: 16 }} />
                    Available Channels
                </h3>

                <div className="flex flex-col gap-2 overflow-y-auto">
                    {allChannels === null ? (
                        <div className="text-gray-500 text-sm text-center py-4">Loading channels...</div>
                    ) : allChannels.length > 0 ? (
                        allChannels.map((ele) => (
                            <button
                                key={ele._id}
                                onClick={() => channelClickHandler(ele)}
                                className="group text-left px-4 py-3 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 text-white font-medium text-sm transition-all duration-200 transform hover:translate-x-1 hover:shadow-lg"
                            >
                                <span className="mr-2">#</span>
                                {ele.channelName}
                            </button>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm text-center py-4">No channels available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

