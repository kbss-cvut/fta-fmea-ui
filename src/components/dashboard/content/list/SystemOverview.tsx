import { Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as React from "react";
import useStyles from "./DashboardList.styles";
import { useState, useEffect } from "react";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import { Link as RouterLink } from "react-router-dom";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { ROUTES } from "@utils/constants";
import { useSystems } from "@hooks/useSystems";
import { System } from "@models/systemModel";
import SystemEditDialog from "@components/dialog/system/SystemEditDialog";
import { contextMenuDefaultAnchor, ElementContextMenuAnchor } from "@utils/contextMenu";
import SystemContextMenu from "@components/editor/system/menu/SystemContextMenu";
import OverviewTypeToggler from "./OverviewTypeToggler";
import { ViewType } from "./types";
import FaultTreeAndSystemOverviewTable from "./FaultTreeAndSystemOverviewTable";
import FaultTreeAndSystemOverviewCardsList from "./FaultTreeAndSystemOverviewCardsList";

const SystemOverview = () => {
  const { classes } = useStyles();
  const [systems, , , removeSystem] = useSystems();

  const [selectedView, setSelectedView] = useState<ViewType>("table");
  const [contextMenuSelectedSystem, setContextMenuSelectedSystem] = useState<System>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor);

  useEffect(() => {
    const storedView = localStorage.getItem("selectedView") as ViewType;
    if (storedView) {
      setSelectedView(storedView);
    }
  }, []);

  const toggleView = (viewType: ViewType) => {
    if (selectedView === viewType) return;
    setSelectedView(viewType);
    localStorage.setItem("selectedView", viewType);
  };

  const handleContextMenu = (evt, system: System) => {
    setContextMenuSelectedSystem(system);
    setContextMenuAnchor({ mouseX: evt.pageX, mouseY: evt.pageY });
  };

  const [showConfirmDialog] = useConfirmDialog();

  const handleDelete = (systemToDelete: System) => {
    showConfirmDialog({
      title: "Delete System",
      explanation:
        "By deleting the system, all components, functions and failure modes will be deleted as well. Proceed to delete the system?",
      onConfirm: () => {
        removeSystem(systemToDelete);
      },
    });
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <Box flexDirection="column">
      <OverviewTypeToggler selectedView={selectedView} toggleView={toggleView} />

      {selectedView === "table" ? (
        <FaultTreeAndSystemOverviewTable systems={systems} handleSystemContextMenu={handleContextMenu} />
      ) : (
        <FaultTreeAndSystemOverviewCardsList systems={systems} handleSystemContextMenu={handleContextMenu} />
      )}

      <SystemContextMenu
        anchorPosition={contextMenuAnchor}
        onEditClick={() => setEditDialogOpen(true)}
        onDelete={() => handleDelete(contextMenuSelectedSystem)}
        onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}
      />

      <SystemEditDialog
        open={editDialogOpen}
        handleCloseDialog={() => setEditDialogOpen(false)}
        system={contextMenuSelectedSystem}
      />
    </Box>
  );
};

export default SystemOverview;
