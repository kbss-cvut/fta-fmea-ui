import React, { useState } from 'react';
import DashboardFaultTreeList from '@components/dashboard/content/list/DashboardFaultTreeList';
import DashboardContentProvider from '@hooks/DashboardContentProvider';
import { Typography, Box, Button } from '@mui/material';
import FaultTreeDialog from '@components/dialog/faultTree/FaultTreeDialog';

const FtaOverview = () => {
    const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState<boolean>(false);

    const handleDialogOpen = () => {
        setCreateFaultTreeDialogOpen(true);
    };

    return (
        <DashboardContentProvider>
            <Box marginTop={3} marginLeft={2} marginRight={2}>
                {/* TODO: Add to sep. component */}
                <Box display='flex' flexDirection='row' justifyContent='space-between'>
                    <Typography variant='h5'>Fault Trees</Typography>
                    <Button variant='contained' onClick={handleDialogOpen}>
                        New Fault tree
                    </Button>
                </Box>

                <DashboardFaultTreeList />
                <FaultTreeDialog open={createFaultTreeDialogOpen} handleCloseDialog={() => setCreateFaultTreeDialogOpen(false)} />
            </Box>
        </DashboardContentProvider>
    );
};

export default FtaOverview;
