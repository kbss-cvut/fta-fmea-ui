import * as React from "react";
import { ChildrenProps } from "../utils/hookUtils";
import { FaultTreesProvider } from "./useFaultTrees";
import { FailureModesTablesProvider } from "./useFailureModesTables";
import { SelectedSystemProvider } from "@hooks/useSelectedSystemSummaries";

const DashboardContentProvider = ({ children }: ChildrenProps) => {
  return (
    <FaultTreesProvider>
      <SelectedSystemProvider>
        <FailureModesTablesProvider>{children}</FailureModesTablesProvider>
      </SelectedSystemProvider>
    </FaultTreesProvider>
  );
};

export default DashboardContentProvider;
