import * as React from "react";
import PersistentDrawer from "@components/drawer/PersistentDrawer";
import {DrawerOpenProvider} from "@hooks/useDrawerOpen";
import {OpenTabsProvider} from "@hooks/useOpenTabs";

const Dashboard = () => {
    return (
        <OpenTabsProvider>
            <DrawerOpenProvider>
                <PersistentDrawer/>
            </DrawerOpenProvider>
        </OpenTabsProvider>
    );
}

export default Dashboard;