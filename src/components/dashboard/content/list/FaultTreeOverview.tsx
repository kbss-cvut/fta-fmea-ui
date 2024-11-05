import React, { useState, useEffect } from "react";
import { ViewType } from "./types";
import OverviewTypeToggler from "./OverviewTypeToggler";
import FaultTreeAndSystemOverviewTable from "../../../table/FaultTreeAndSystemOverviewTable";
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
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import Tooltip from "@mui/material/Tooltip";
import { asArray } from "@utils/utils";

const FaultTreeOverview = () => {
  const { t } = useTranslation();
  const [showConfirmDialog] = useConfirmDialog();
  const [faultTrees, , , removeTree, loading, triggerFetch] = useFaultTrees();

  const [selectedView, setSelectedView] = useState<ViewType>("table");
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [contextMenuSelectedTree, setContextMenuSelectedTree] = useState<FaultTree>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor);
  const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState<boolean>(false);
  const [selectedSystem] = useSelectedSystemSummaries();
  const [currentFilters, setCurrentFilters] = useState<{ label?: string; snsLabel?: string }>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "date",
    direction: "desc",
  });
  const isTreeCreationDisabled = !selectedSystem;

  useEffect(() => {
    const storedView = localStorage.getItem(SELECTED_VIEW) as ViewType;
    if (storedView) {
      setSelectedView(storedView);
    }
  }, []);

  useEffect(() => {
    triggerFetch();
  }, []);

  const handleFilterChange = async (label: string, snsLabel: string) => {
    const filters = { label, snsLabel };
    setCurrentFilters(filters);
    await triggerFetch({ ...filters, sort: `${sortConfig.direction === "asc" ? "+" : "-"}${sortConfig.key}` });
  };

  const handleSortChange = async (columnKey: string) => {
    const isAsc = sortConfig.key === columnKey && sortConfig.direction === "asc";
    const newSortConfig = { key: columnKey, direction: isAsc ? "desc" : "asc" };
    setSortConfig(newSortConfig);
    await triggerFetch({ ...currentFilters, sort: `${newSortConfig.direction === "asc" ? "+" : "-"}${columnKey}` });
  };

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
      title: t("deleteFtaModal.title"),
      explanation: t("deleteFtaModal.explanation"),
      onConfirm: () => {
        removeTree(treeToDelete);
      },
    });
  };
  const canRename = asArray(contextMenuSelectedTree?.manifestingEvent?.supertypes)?.[0]?.auxiliary;
  return (
    <Box flexDirection="column">
      <Box display="flex" flexDirection="row-reverse">
        <OverviewTypeToggler selectedView={selectedView} toggleView={toggleView} />
        <Tooltip title={isTreeCreationDisabled ? t("create.systemRequired") : ""}>
          <span>
            <Button
              variant="contained"
              onClick={handleDialogOpen}
              disabled={isTreeCreationDisabled}
              sx={{ height: 36 }}
            >
              {t("create.tree")}
            </Button>
          </span>
        </Tooltip>
      </Box>

      {selectedView === "table" ? (
        <FaultTreeAndSystemOverviewTable
          selectedSystem={selectedSystem}
          faultTrees={faultTrees}
          loading={loading}
          handleFaultTreeContextMenu={handleContextMenu}
          handleFilterChange={handleFilterChange}
          sortConfig={sortConfig}
          handleSortChange={handleSortChange}
        />
      ) : (
        <FaultTreeAndSystemOverviewCardsList
          selectedSystem={selectedSystem}
          faultTrees={faultTrees}
          loading={loading}
          handleFaultTreeContextMenu={handleContextMenu}
        />
      )}
      <FaultTreeContextMenu
        anchorPosition={contextMenuAnchor}
        onEditClick={() => setEditDialogOpen(true)}
        onDelete={() => handleDelete(contextMenuSelectedTree)}
        onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}
        canRename={canRename}
        renameTooltip={
          canRename ? t("faultTreeOverviewTable.renameHint") : t("faultTreeOverviewTable.renameDisabledHint")
        }
        deleteTooltip={t("faultTreeOverviewTable.deleteHint")}
      />

      <FaultTreeEditDialog
        open={editDialogOpen}
        handleCloseDialog={() => setEditDialogOpen(false)}
        faultTree={contextMenuSelectedTree}
      />
      <FaultTreeDialog open={createFaultTreeDialogOpen} handleCloseDialog={() => setCreateFaultTreeDialogOpen(false)} />
    </Box>
  );
};

export default FaultTreeOverview;
