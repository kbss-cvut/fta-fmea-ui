import React from 'react';
import DashboardSystemList from '@components/dashboard/content/list/DashboardSystemList';
import DashboardContentProvider from '@hooks/DashboardContentProvider';
import { Divider, Typography } from '@mui/material';

const SystemsOverview = () => {
    return (
        <DashboardContentProvider>
            <Typography variant='h5'>Systems</Typography>
            <Divider />
            <DashboardSystemList />
        </DashboardContentProvider>
    );
};

export default SystemsOverview;
