import Button from '@mui/material/Button'
import React from 'react'

export const CreateChannelBtn = () => {
    return (
        <div>

            <Button
                variant='contained'
                fullWidth
                sx={{ padding: '1rem' }}
            >
                Create Channel
            </Button>
        </div>
    )
}
