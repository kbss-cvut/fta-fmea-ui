import {
  Card,
  CardActions,
  CardHeader,
  ImageList,
  ImageListItem,
  IconButton,
  Link as MaterialLink,
  Tooltip,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as React from "react";
import { useFaultTrees } from "@hooks/useFaultTrees";
import useStyles from "./DashboardList.styles";
import { useState } from "react";
import { FaultTree } from "@models/faultTreeModel";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import FaultTreeContextMenu from "@components/editor/faultTree/menu/faultTree/FaultTreeContextMenu";
import FaultTreeEditDialog from "@components/dialog/faultTree/FaultTreeEditDialog";
import { Link as RouterLink } from "react-router-dom";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { ROUTES } from "@utils/constants";
import { contextMenuDefaultAnchor, ElementContextMenuAnchor } from "@utils/contextMenu";
import { useTranslation } from "react-i18next";

const DashboardFaultTreeList = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  const [faultTrees, , , removeTree] = useFaultTrees();

  const [contextMenuSelectedTree, setContextMenuSelectedTree] = useState<FaultTree>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor);

  const handleContextMenu = (evt, faultTree: FaultTree) => {
    setContextMenuSelectedTree(faultTree);
    setContextMenuAnchor({ mouseX: evt.pageX, mouseY: evt.pageY });
  };

  const [showConfirmDialog] = useConfirmDialog();

  const handleDelete = (treeToDelete: FaultTree) => {
    showConfirmDialog({
      title: t("deleteFtaModal.title"),
      explanation: t("deleteFtaModal.explanation"),
      onConfirm: () => {
        removeTree(treeToDelete);
      },
    });
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <React.Fragment>
      <ImageList className={classes.gridList} cols={6}>
        {faultTrees.map((tree) => {
          const routePath = ROUTES.FTA + `/${extractFragment(tree.iri)}`;
          return (
            <ImageListItem key={tree.iri} className={classes.gridListTile}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{ content: classes.cardTitle }}
                  action={
                    <IconButton aria-label="settings" onClick={(e) => handleContextMenu(e, tree)} size="large">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    <Tooltip title={tree.name}>
                      <Typography variant="h5">{tree.name}</Typography>
                    </Tooltip>
                  }
                />
                <CardActions disableSpacing>
                  <MaterialLink variant="button" component={RouterLink} to={routePath}>
                    Open
                  </MaterialLink>
                </CardActions>
              </Card>
            </ImageListItem>
          );
        })}
      </ImageList>

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
    </React.Fragment>
  );
};

export default DashboardFaultTreeList;
