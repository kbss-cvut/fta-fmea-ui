import * as React from "react";
import { ChildrenProps } from "../utils/hookUtils";
import { FaultTreesProvider } from "./useFaultTrees";
import { FailureModesTablesProvider } from "./useFailureModesTables";
import { SystemsProvider } from "@hooks/useSystems";
import {SelectedSystemProvider} from "@hooks/useSelectedSystem";

const DashboardContentProvider = ({ children }: ChildrenProps) => {
  return (

    <FaultTreesProvider>
      <SystemsProvider>
        <SelectedSystemProvider>
          <FailureModesTablesProvider>{children}</FailureModesTablesProvider>
        </SelectedSystemProvider>
      </SystemsProvider>
    </FaultTreesProvider>
  );
};

export default DashboardContentProvider;
