import * as React from "react";
import PersistentDrawer from "@components/drawer/PersistentDrawer";
import {DrawerOpenProvider} from "@hooks/useDrawerOpen";
import {FailureModesProvider} from "@hooks/useFailureModes";

const Dashboard = () => {
    return (
        <FailureModesProvider>
            <DrawerOpenProvider>
                <PersistentDrawer/>
            </DrawerOpenProvider>
        </FailureModesProvider>
    );
}

export default Dashboard;