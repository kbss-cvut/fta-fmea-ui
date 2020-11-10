import * as React from "react";
import PersistentDrawer from "@components/drawer/PersistentDrawer";
import {DrawerOpenProvider} from "@hooks/useDrawerOpen";
import {FaultTreesProvider} from "@hooks/useFaultTrees";

const Dashboard = () => {
    return (
        <FaultTreesProvider>
            <DrawerOpenProvider>
                <PersistentDrawer/>
            </DrawerOpenProvider>
        </FaultTreesProvider>
    );
}

export default Dashboard;