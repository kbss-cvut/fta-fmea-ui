import * as React from "react";
import {ChildrenProps} from "../utils/hookUtils";
import {FaultTreesProvider} from "./useFaultTrees";
import {FailureModesTablesProvider} from "./useFailureModesTables";
import {SystemsProvider} from "@hooks/useSystems";

const DashboardContentProvider = ({children}: ChildrenProps) => {
    return (
        <FaultTreesProvider>
            <SystemsProvider>
                <FailureModesTablesProvider>
                    {children}
                </FailureModesTablesProvider>
            </SystemsProvider>
        </FaultTreesProvider>
    );
};

export default DashboardContentProvider;