import * as React from "react";
import DiagramOptions, { Props as DiagramOptionsProps } from "../../menu/DiagramOptions";
import FaultTreeFailureModesTable from "./failureModesTable/FaultTreeFailureModesTable";
import { useCurrentFaultTreeTable } from "@hooks/useCurrentFaultTreeTable";

const SidebarMenuHeader = ({
  onConvertToTable,
  onExportDiagram,
  onRestoreLayout,
  onCutSetAnalysis,
}: DiagramOptionsProps) => {
  const table = useCurrentFaultTreeTable();

  return (
    <React.Fragment>
      <DiagramOptions
        onExportDiagram={onExportDiagram}
        onConvertToTable={onConvertToTable}
        onRestoreLayout={onRestoreLayout}
        onCutSetAnalysis={onCutSetAnalysis}
        tableConversionAllowed={!table}
      />

      <FaultTreeFailureModesTable table={table} />
    </React.Fragment>
  );
};

export default SidebarMenuHeader;
