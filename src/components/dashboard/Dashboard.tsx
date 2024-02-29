import * as React from 'react';
import DashboardContentProvider from '@hooks/DashboardContentProvider';
import DashboardContent from '@components/dashboard/content/DashboardContent';

const Dashboard = () => {
    return (
        <DashboardContentProvider>
            <DashboardContent />
        </DashboardContentProvider>
    );
};

export default Dashboard;
