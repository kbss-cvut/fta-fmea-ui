import * as React from "react";
import {ChildrenProps} from "../utils/hookUtils";
import {FaultTreesProvider} from "./useFaultTrees";
import {FailureModesProvider} from "./useFailureModes";
import {SystemsProvider} from "@hooks/useSystems";

const DashboardContentProvider = ({children}: ChildrenProps) => {
    return (
        <FaultTreesProvider>
            <SystemsProvider>
                <FailureModesProvider>
                    {children}
                </FailureModesProvider>
            </SystemsProvider>
        </FaultTreesProvider>
    );
};

export default DashboardContentProvider;