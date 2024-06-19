import * as React from "react";
import { useState, useEffect } from "react";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import { useSystems } from "@hooks/useSystems";
import { System } from "@models/systemModel";
import SystemEditDialog from "@components/dialog/system/SystemEditDialog";
import { contextMenuDefaultAnchor, ElementContextMenuAnchor } from "@utils/contextMenu";
import SystemContextMenu from "@components/editor/system/menu/SystemContextMenu";
import OverviewTypeToggler from "./OverviewTypeToggler";
import { ViewType } from "./types";
import FaultTreeAndSystemOverviewTable from "./FaultTreeAndSystemOverviewTable";
import FaultTreeAndSystemOverviewCardsList from "./FaultTreeAndSystemOverviewCardsList";
import { useTranslation } from "react-i18next";
import { Button, Box } from "@mui/material";
import SystemDialog from "@components/dialog/system/SystemDialog";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";

const SystemOverview = () => {
  const { t } = useTranslation();
  const [showConfirmDialog] = useConfirmDialog();
  const [systems, , , removeSystem] = useSystems();

  const [selectedView, setSelectedView] = useState<ViewType>("table");
  const [contextMenuSelectedSystem, setContextMenuSelectedSystem] = useState<System>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createSystemDialogOpen, setCreateSystemDialogOpen] = useState<boolean>(false);
  const [selectedSystem, setSelectedSystem] = useSelectedSystemSummaries();

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

  const handleDialogOpen = () => {
    setCreateSystemDialogOpen(true);
  };

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

  return (
    <Box flexDirection="column">
      <Box display="flex" flexDirection="row-reverse">
        <OverviewTypeToggler selectedView={selectedView} toggleView={toggleView} />
        <Button variant="contained" onClick={handleDialogOpen}>
          {t("create.system")}
        </Button>
      </Box>

      {selectedView === "table" ? (
        <FaultTreeAndSystemOverviewTable systems={systems} handleSystemContextMenu={handleContextMenu} />
      ) : (
        <FaultTreeAndSystemOverviewCardsList
          selectedSystem={selectedSystem}
          systems={systems}
          handleSystemContextMenu={handleContextMenu}
        />
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
      <SystemDialog open={createSystemDialogOpen} handleCloseDialog={() => setCreateSystemDialogOpen(false)} />
    </Box>
  );
};

export default SystemOverview;
