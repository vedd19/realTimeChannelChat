import Button from '@mui/material/Button'
import React, { useState, useContext } from 'react'
import { CreateChannelModal } from './CreateChannelModal';
import { UserDataContext } from '../context/UserDataContext';

export const CreateChannelBtn = () => {
    const [isOpen, setIsOpen] = useState(false);
    const context = useContext(UserDataContext);
    const { setAllChannels } = context || {};

    return (
        <div>
            <Button
                size='small'
                variant='contained'
                fullWidth
                onClick={() => { setIsOpen(true) }}
            >
                Create Channel
            </Button>

            <CreateChannelModal isOpen={isOpen} setIsOpen={setIsOpen} setAllChannels={setAllChannels} />
        </div>
    )
}
