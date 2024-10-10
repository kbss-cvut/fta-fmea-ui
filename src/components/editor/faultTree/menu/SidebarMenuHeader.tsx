import * as React from "react";
import DiagramOptions, { Props as DiagramOptionsProps } from "../../menu/DiagramOptions";
import FaultTreeFailureModesTable from "./failureModesTable/FaultTreeFailureModesTable";
import { useCurrentFaultTreeTable } from "@hooks/useCurrentFaultTreeTable";
import { Box } from "@mui/material";
import { useAppBar } from "@contexts/AppBarContext";

type SidebarMenuHeaderProps = DiagramOptionsProps;

const useActionCall = (isModified: boolean, setShowUnsavedChangesDialog: (show: boolean) => void) => {
  return React.useCallback(
    (action: () => void) => {
      if (isModified) {
        setShowUnsavedChangesDialog(true);
      } else {
        action();
      }
    },
    [isModified, setShowUnsavedChangesDialog],
  );
};

const SidebarMenuHeader: React.FC<SidebarMenuHeaderProps> = ({
  onConvertToTable,
  onExportDiagram,
  onApplyAutomaticLayout,
  onCutSetAnalysis,
  rendering,
}) => {
  const table = useCurrentFaultTreeTable();
  const { isModified, setShowUnsavedChangesDialog } = useAppBar();

  const actionCall = useActionCall(isModified, setShowUnsavedChangesDialog);

  return (
    <Box padding={2} style={{ padding: "0px" }}>
      <DiagramOptions
        onExportDiagram={() => actionCall(onExportDiagram)}
        onConvertToTable={() => actionCall(onConvertToTable)}
        onApplyAutomaticLayout={() => actionCall(onApplyAutomaticLayout)}
        onCutSetAnalysis={() => actionCall(onCutSetAnalysis)}
        tableConversionAllowed={!table}
        rendering={rendering}
      />
      <FaultTreeFailureModesTable table={table} />
    </Box>
  );
};

export default SidebarMenuHeader;
