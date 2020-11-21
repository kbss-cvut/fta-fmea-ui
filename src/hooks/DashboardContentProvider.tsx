import * as React from "react";
import {ChildrenProps} from "../utils/hookUtils";
import {FaultTreesProvider} from "./useFaultTrees";
import {FailureModesProvider} from "./useFailureModes";

const DashboardContentProvider = ({children}: ChildrenProps) => {
    return (
        <FaultTreesProvider>
            <FailureModesProvider>
                {children}
            </FailureModesProvider>
        </FaultTreesProvider>
    );
};

export default DashboardContentProvider;