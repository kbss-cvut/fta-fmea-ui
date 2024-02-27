import React from 'react';
import DashboardFaultTreeList from '@components/dashboard/content/list/DashboardFaultTreeList';
import DashboardContentProvider from '@hooks/DashboardContentProvider';
import { Divider, Typography } from '@mui/material';


const FtaOverview = () => {
    return (
        <DashboardContentProvider>
            <Typography variant='h5'>Fault Trees</Typography>
            <Divider />
            <DashboardFaultTreeList />
        </DashboardContentProvider>
    );
};

export default FtaOverview;
