import * as React from "react";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  contextMenuDefaultAnchor,
  ElementContextMenuAnchor,
} from "../editor/faultTree/menu/faultEvent/FaultEventContextMenu";
import FaultTreeContextMenu from "../editor/faultTree/menu/faultTree/FaultTreeContextMenu";
import { FaultTree } from "@models/faultTreeModel";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import { useFaultTrees } from "@hooks/useFaultTrees";
import FaultTreeEditDialog from "@components/dialog/faultTree/FaultTreeEditDialog";

interface Props {
  faultTree: FaultTree;
  onClick: (any) => void;
}

const FaultTreeListItem = ({ faultTree, onClick }: Props) => {
  const [contextMenuSelectedTree, setContextMenuSelectedTree] = useState<FaultTree>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor);

  const handleContextMenu = (evt) => {
    setContextMenuSelectedTree(faultTree);
    setContextMenuAnchor({ mouseX: evt.pageX, mouseY: evt.pageY });
  };

  const [showConfirmDialog] = useConfirmDialog();
  const [, , , removeTree] = useFaultTrees();

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

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <React.Fragment>
      <ListItem button onClick={onClick}>
        <ListItemText primary={faultTree.name} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleContextMenu} size="large">
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <FaultTreeContextMenu
        anchorPosition={contextMenuAnchor}
        onEditClick={() => setEditDialogOpen(true)}
        onDelete={() => handleDelete(contextMenuSelectedTree)}
        onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}
      />

      <FaultTreeEditDialog
        open={editDialogOpen}
        handleCloseDialog={() => setEditDialogOpen(false)}
        faultTree={faultTree}
      />
    </React.Fragment>
  );
};

export default FaultTreeListItem;
