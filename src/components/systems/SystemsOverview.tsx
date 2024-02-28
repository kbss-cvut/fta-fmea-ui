import React, { useState } from 'react';
import DashboardSystemList from '@components/dashboard/content/list/DashboardSystemList';
import DashboardContentProvider from '@hooks/DashboardContentProvider';
import { Typography, Button, Box } from '@mui/material';
import SystemDialog from '@components/dialog/system/SystemDialog';

const SystemsOverview = () => {
    const [createSystemDialogOpen, setCreateSystemDialogOpen] = useState<boolean>(false);

    const handleDialogOpen = () => {
        setCreateSystemDialogOpen(true);
    };

    return (
        <DashboardContentProvider>
            <Box marginTop={3} marginLeft={2} marginRight={2}>
                {/* TODO: Add to sep. component */}
                <Box display='flex' flexDirection='row' justifyContent='space-between'>
                    <Typography variant='h5'>Systems</Typography>
                    <Button variant='contained' onClick={handleDialogOpen}>
                        New system
                    </Button>
                </Box>

                <DashboardSystemList />
                <SystemDialog open={createSystemDialogOpen} handleCloseDialog={() => setCreateSystemDialogOpen(false)} />
            </Box>
        </DashboardContentProvider>
    );
};

export default SystemsOverview;
