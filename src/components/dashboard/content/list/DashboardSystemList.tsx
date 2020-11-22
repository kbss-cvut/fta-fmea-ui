import {
    Button,
    Card,
    CardActions,
    CardHeader,
    Grid,
    GridList,
    GridListTile,
    IconButton,
    Link as MaterialLink
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import {useFaultTrees} from "@hooks/useFaultTrees";
import useStyles from "./DashboardList.styles";
import {useState} from "react";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import {Link as RouterLink} from "react-router-dom";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {ROUTES} from "@utils/constants";
import {useSystems} from "@hooks/useSystems";
import {System} from "@models/systemModel";
import SystemEditDialog from "@components/dialog/system/SystemEditDialog";
import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@utils/contextMenu";
import SystemContextMenu from "@components/editor/system/menu/SystemContextMenu";

const DashboardSystemList = () => {
    const classes = useStyles();
    const [systems, , , removeSystem] = useSystems();

    const [contextMenuSelectedSystem, setContextMenuSelectedSystem] = useState<System>(null)
    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)

    const handleContextMenu = (evt, system: System) => {
        setContextMenuSelectedSystem(system);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [showConfirmDialog] = useConfirmDialog();

    const handleDelete = (systemToDelete: System) => {
        showConfirmDialog({
            title: 'Delete System',
            explanation: 'By deleting the system, all components, functions and failure modes will be deleted as well. Proceed to delete the system?',
            onConfirm: () => {
                removeSystem(systemToDelete);
            },
        })
    }

    const [editDialogOpen, setEditDialogOpen] = useState(false)

    return (
        <React.Fragment>
            <GridList className={classes.gridList} cols={6}>
                {systems.map((system) => {
                    const routePath = ROUTES.SYSTEM + extractFragment(system.iri);
                    return (
                        <GridListTile key={system.iri} className={classes.gridListTile}>
                            <Card className={classes.card}>
                                <CardHeader
                                    action={
                                        <IconButton aria-label="settings" onClick={(e) => handleContextMenu(e, system)}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                    }
                                    title={system.name}
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

            <SystemContextMenu
                anchorPosition={contextMenuAnchor}
                onEditClick={() => setEditDialogOpen(true)}
                onDelete={() => handleDelete(contextMenuSelectedSystem)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}/>

            <SystemEditDialog open={editDialogOpen}
                              handleCloseDialog={() => setEditDialogOpen(false)}
                              system={contextMenuSelectedSystem}/>
        </React.Fragment>
    );
}

export default DashboardSystemList;