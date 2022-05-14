import {
    Card,
    CardActions,
    CardHeader,
    GridList,
    GridListTile,
    IconButton,
    Link as MaterialLink,
    Tooltip,
    Typography
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import {useFaultTrees} from "@hooks/useFaultTrees";
import useStyles from "./DashboardList.styles";
import {useState} from "react";
import {FaultTree} from "@models/faultTreeModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import FaultTreeContextMenu from "@components/editor/faultTree/menu/faultTree/FaultTreeContextMenu";
import FaultTreeEditDialog from "@components/dialog/faultTree/FaultTreeEditDialog";
import {Link as RouterLink} from "react-router-dom";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {ROUTES} from "@utils/constants";
import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@utils/contextMenu";

const DashboardFaultTreeList = () => {
    const classes = useStyles();
    const [faultTrees, , , removeTree] = useFaultTrees();

    const [contextMenuSelectedTree, setContextMenuSelectedTree] = useState<FaultTree>(null)
    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)

    const handleContextMenu = (evt, faultTree: FaultTree) => {
        setContextMenuSelectedTree(faultTree);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [showConfirmDialog] = useConfirmDialog();

    const handleDelete = (treeToDelete: FaultTree) => {
        showConfirmDialog({
            title: 'Delete Fault Tree',
            explanation: 'Deleting fault tree will delete the whole tree structure. Events will remain. Proceed to delete the tree?',
            onConfirm: () => {
                removeTree(treeToDelete);
            },
        })
    }

    const [editDialogOpen, setEditDialogOpen] = useState(false)

    return (
        <React.Fragment>
            <GridList className={classes.gridList} cols={6}>
                {faultTrees.map((tree) => {
                    const routePath = ROUTES.FTA + extractFragment(tree.iri);
                    return (
                        <GridListTile key={tree.iri} className={classes.gridListTile}>
                            <Card className={classes.card}>
                                <CardHeader 
                                    classes={{content: classes.cardTitle}}
                                    action={
                                        <IconButton aria-label="settings" onClick={(e) => handleContextMenu(e, tree)}>
                                            <MoreVertIcon/>
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
                        </GridListTile>
                    )
                })}
            </GridList>

            <FaultTreeContextMenu
                anchorPosition={contextMenuAnchor}
                onEditClick={() => setEditDialogOpen(true)}
                onDelete={() => handleDelete(contextMenuSelectedTree)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}/>

            <FaultTreeEditDialog open={editDialogOpen}
                                 handleCloseDialog={() => setEditDialogOpen(false)}
                                 faultTree={contextMenuSelectedTree}/>
        </React.Fragment>
    );
}

export default DashboardFaultTreeList;