import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { CreateChannelModal } from './CreateChannelModal';

export const CreateChannelBtn = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>

            <Button
                size='small'
                variant='contained'
                fullWidth
                // sx={{ padding: '0rem' }}
                onClick={() => { setIsOpen(true) }}
            >
                Create Channel
            </Button>

            <CreateChannelModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}
