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
import {useFailureModes} from "@hooks/useFailureModes";
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
import FailureModeContextMenu from "@components/editor/failureMode/menu/FailureModeContextMenu";
import SystemEditDialog from "@components/dialog/system/SystemEditDialog";
import FailureModeRenameDialog from "@components/dialog/failureMode/rename/FailureModeRenameDialog";

const DashboardFailureModeList = () => {
    const classes = useStyles();
    const [failureModes, , removeFailureMode] = useFailureModes();

    const [contextMenuSelectedFailureMode, setContextMenuSelectedFailureMode] = useState<FailureMode>(null)
    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)

    const handleContextMenu = (evt, failureMode: FailureMode) => {
        setContextMenuSelectedFailureMode(failureMode);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [showConfirmDialog] = useConfirmDialog();

    const handleDelete = (failureMode: FailureMode) => {
        showConfirmDialog({
            title: 'Delete Failure Mode',
            explanation: 'Proceed to delete the failure mode?',
            onConfirm: () => {
                removeFailureMode(failureMode);
            },
        })
    }

    const [renameDialogOpen, setRenameDialogOpen] = useState(false)

    return (
        <React.Fragment>
            <GridList className={classes.gridList} cols={6}>
                {failureModes.map((mode) => {
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

            <FailureModeContextMenu
                anchorPosition={contextMenuAnchor}
                onRenameClick={() => setRenameDialogOpen(true)}
                onDelete={() => handleDelete(contextMenuSelectedFailureMode)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}/>

            <FailureModeRenameDialog open={renameDialogOpen}
                                     handleCloseDialog={() => setRenameDialogOpen(false)}
                                     failureMode={contextMenuSelectedFailureMode}/>
        </React.Fragment>
    );
}

export default DashboardFailureModeList;