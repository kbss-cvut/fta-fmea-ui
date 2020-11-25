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
import {useFailureModesTables} from "@hooks/useFailureModesTables";
import useStyles from "@components/dashboard/content/list/DashboardList.styles";
import {ROUTES} from "@utils/constants";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {Link as RouterLink} from "react-router-dom";
import {System} from "@models/systemModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import {useState} from "react";
import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@utils/contextMenu";
import {FailureMode} from "@models/failureModeModel";
import SystemContextMenu from "@components/editor/system/menu/SystemContextMenu";
import FailureModeTableContextMenu from "@components/editor/failureMode/menu/FailureModeTableContextMenu";
import SystemEditDialog from "@components/dialog/system/SystemEditDialog";
import FailureModesTableRenameDialog from "@components/dialog/failureModesTable/rename/FailureModesTableRenameDialog";
import {FailureModesTable} from "@models/failureModesTableModel";

const DashboardFailureModesTableList = () => {
    const classes = useStyles();
    const [tables, , removeTable] = useFailureModesTables();

    const [contextMenuSelectedTable, setContextMenuSelectedTable] = useState<FailureModesTable>(null)
    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)

    const handleContextMenu = (evt, selectedTable: FailureModesTable) => {
        setContextMenuSelectedTable(selectedTable);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [showConfirmDialog] = useConfirmDialog();

    const handleDelete = (tableToDelete: FailureModesTable) => {
        showConfirmDialog({
            title: 'Delete Failure Modes Table',
            explanation: 'Proceed to delete the failure modes table?',
            onConfirm: () => {
                removeTable(tableToDelete);
            },
        })
    }

    const [renameDialogOpen, setRenameDialogOpen] = useState(false)

    return (
        <React.Fragment>
            <GridList className={classes.gridList} cols={6}>
                {tables.map((mode) => {
                    const routePath = ROUTES.FMEA + extractFragment(mode.iri);
                    return (
                        <GridListTile key={mode.iri} className={classes.gridListTile}>
                            <Card className={classes.card}>
                                <CardHeader
                                    action={
                                        <IconButton aria-label="settings" onClick={(e) => handleContextMenu(e, mode)}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                    }
                                    title={mode.name}
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

            <FailureModeTableContextMenu
                anchorPosition={contextMenuAnchor}
                onRenameClick={() => setRenameDialogOpen(true)}
                onDelete={() => handleDelete(contextMenuSelectedTable)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}/>

            <FailureModesTableRenameDialog open={renameDialogOpen}
                                           handleCloseDialog={() => setRenameDialogOpen(false)}
                                           failureModesTable={contextMenuSelectedTable}/>
        </React.Fragment>
    );
}

export default DashboardFailureModesTableList;