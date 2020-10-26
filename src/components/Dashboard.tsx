import * as React from "react";
import PersistentDrawer from "@components/drawer/PersistentDrawer";
import {DrawerOpenProvider} from "@hooks/useDrawerOpen";

const Dashboard = () => {
    return (
        <DrawerOpenProvider>
            <PersistentDrawer/>
        </DrawerOpenProvider>
    );
}

export default Dashboard;