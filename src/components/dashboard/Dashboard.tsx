import * as React from 'react';
import DashboardContentProvider from '@hooks/DashboardContentProvider';
import DashboardContent from '@components/dashboard/content/DashboardContent';
import useStyles from '@components/dashboard/Dashboard.styles';

const Dashboard = () => {
    const { classes } = useStyles();

    return (
        <DashboardContentProvider>
            <DashboardContent />
        </DashboardContentProvider>
    );
};

export default Dashboard;
