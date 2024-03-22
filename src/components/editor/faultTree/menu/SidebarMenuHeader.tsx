import * as React from "react";
import DiagramOptions, { Props as DiagramOptionsProps } from "../../menu/DiagramOptions";
import FaultTreeFailureModesTable from "./failureModesTable/FaultTreeFailureModesTable";
import { useCurrentFaultTreeTable } from "@hooks/useCurrentFaultTreeTable";
import { Box } from "@mui/material";

const SidebarMenuHeader = ({
  onConvertToTable,
  onExportDiagram,
  onRestoreLayout,
  onCutSetAnalysis,
}: DiagramOptionsProps) => {
  const table = useCurrentFaultTreeTable();

  return (
    <Box padding={2}>
      <DiagramOptions
        onExportDiagram={onExportDiagram}
        onConvertToTable={onConvertToTable}
        onRestoreLayout={onRestoreLayout}
        onCutSetAnalysis={onCutSetAnalysis}
        tableConversionAllowed={!table}
      />

      <FaultTreeFailureModesTable table={table} />
    </Box>
  );
};

export default SidebarMenuHeader;
