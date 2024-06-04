import React, { useState, useEffect } from "react";
import { ViewType } from "./types";
import OverviewTypeToggler from "./OverviewTypeToggler";
import FaultTreeAndSystemOverviewTable from "./FaultTreeAndSystemOverviewTable";
import FaultTreeAndSystemOverviewCardsList from "./FaultTreeAndSystemOverviewCardsList";
import { FaultTree } from "@models/faultTreeModel";
import { contextMenuDefaultAnchor, ElementContextMenuAnchor } from "@utils/contextMenu";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import { useFaultTrees } from "@hooks/useFaultTrees";
import FaultTreeContextMenu from "@components/editor/faultTree/menu/faultTree/FaultTreeContextMenu";
import FaultTreeEditDialog from "@components/dialog/faultTree/FaultTreeEditDialog";
import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SELECTED_VIEW } from "@utils/constants";
import {useSelectedSystem} from "@hooks/useSelectedSystem";

const FaultTreeOverview = () => {
  const { t } = useTranslation();
  const [showConfirmDialog] = useConfirmDialog();
  const [faultTrees, , , removeTree] = useFaultTrees();

  const [selectedView, setSelectedView] = useState<ViewType>("table");
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [contextMenuSelectedTree, setContextMenuSelectedTree] = useState<FaultTree>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor);
  const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState<boolean>(false);
  const [selectedSystem] = useSelectedSystem();

  useEffect(() => {
    const storedView = localStorage.getItem(SELECTED_VIEW) as ViewType;
    if (storedView) {
      setSelectedView(storedView);
    }
  }, []);

  const toggleView = (viewType: ViewType) => {
    if (selectedView === viewType) return;
    setSelectedView(viewType);
    localStorage.setItem(SELECTED_VIEW, viewType);
  };

  const handleContextMenu = (evt, faultTree: FaultTree) => {
    setContextMenuSelectedTree(faultTree);
    setContextMenuAnchor({ mouseX: evt.pageX, mouseY: evt.pageY });
  };

  const handleDialogOpen = () => {
    setCreateFaultTreeDialogOpen(true);
  };

  const handleDelete = (treeToDelete: FaultTree) => {
    showConfirmDialog({
      title: "Delete Fault Tree",
      explanation:
        "Deleting fault tree will delete the whole tree structure. Events will remain. Proceed to delete the tree?",
      onConfirm: () => {
        removeTree(treeToDelete);
      },
    });
  };

  return (
    <Box flexDirection="column">
      <Box display="flex" flexDirection="row-reverse">
        <OverviewTypeToggler selectedView={selectedView} toggleView={toggleView} />
        <Button variant="contained" onClick={handleDialogOpen} sx={{ height: 36 }}>
          {t("create.tree")}
        </Button>
      </Box>

      {selectedView === "table" ? (
        <FaultTreeAndSystemOverviewTable
          selectedSystem={selectedSystem?.iri}
          faultTrees={faultTrees}
          handleFaultTreeContextMenu={handleContextMenu}
        />
      ) : (
        <FaultTreeAndSystemOverviewCardsList
          selectedSystem={selectedSystem?.iri}
          faultTrees={faultTrees}
          handleFaultTreeContextMenu={handleContextMenu}
        />
      )}
      <FaultTreeContextMenu
        anchorPosition={contextMenuAnchor}
        onEditClick={() => setEditDialogOpen(true)}
        onDelete={() => handleDelete(contextMenuSelectedTree)}
        onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}
      />

      <FaultTreeEditDialog
        open={editDialogOpen}
        handleCloseDialog={() => setEditDialogOpen(false)}
        faultTree={contextMenuSelectedTree}
      />
      <FaultTreeDialog
        open={createFaultTreeDialogOpen}
        handleCloseDialog={() => setCreateFaultTreeDialogOpen(false)}
      />
    </Box>
  );
};

export default FaultTreeOverview;
