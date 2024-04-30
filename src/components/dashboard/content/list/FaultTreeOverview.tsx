import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
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

const FaultTreeOverview = () => {
  const [faultTrees, , , removeTree] = useFaultTrees();
  const [selectedView, setSelectedView] = useState<ViewType>("table");
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [contextMenuSelectedTree, setContextMenuSelectedTree] = useState<FaultTree>(null);
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

  const handleContextMenu = (evt, faultTree: FaultTree) => {
    setContextMenuSelectedTree(faultTree);
    setContextMenuAnchor({ mouseX: evt.pageX, mouseY: evt.pageY });
  };

  const [showConfirmDialog] = useConfirmDialog();

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
      <OverviewTypeToggler selectedView={selectedView} toggleView={toggleView} />
      {selectedView === "table" ? (
        <FaultTreeAndSystemOverviewTable faultTrees={faultTrees} handleFaultTreeContextMenu={handleContextMenu} />
      ) : (
        <FaultTreeAndSystemOverviewCardsList faultTrees={faultTrees} handleFaultTreeContextMenu={handleContextMenu} />
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
    </Box>
  );
};

export default FaultTreeOverview;
