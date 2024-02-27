import React from 'react';
import DashboardContentProvider from '@hooks/DashboardContentProvider';
import { Divider, Typography } from '@mui/material';
import DashboardFailureModesTableList from '@components/dashboard/content/list/DashboardFailureModesTableList';

const FmeaOverview = () => {
    return (
        <DashboardContentProvider>
            <Typography variant='h5'>FMEA Worksheets</Typography>
            <Divider />
            <DashboardFailureModesTableList />
        </DashboardContentProvider>
    );
};

export default FmeaOverview;
