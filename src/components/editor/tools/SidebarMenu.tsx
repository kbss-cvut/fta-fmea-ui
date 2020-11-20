import * as React from "react";
import useStyles from "./SidebarMenu.styles";
import {Button, Divider, IconButton, Paper, Typography} from "@material-ui/core";
import ShapeToolPane from "./ShapeToolPane";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import {useState} from "react";
import {EventType, FaultEvent} from "@models/eventModel";
import FailureModeDialog from "@components/dialog/failureMode/FailureModeDialog";

interface Props {
    onRestoreLayout: () => void,
    onExportDiagram: () => void,
    shapeToolData?: FaultEvent,
    onEventUpdated: (faultEvent: FaultEvent) => void,
}

const SidebarMenu = ({onRestoreLayout, onExportDiagram, shapeToolData, onEventUpdated}: Props) => {
    const classes = useStyles()

    const [failureModeDialogOpen, setFailureModeDialogOpen] = useState(false);

    return (
        <Paper className={classes.paper} elevation={3}>
            <Typography variant="h5" gutterBottom>Diagram Options</Typography>
            <div>
                <IconButton color="primary" onClick={onRestoreLayout} aria-label="restore layout">
                    <AccountTreeIcon/>
                </IconButton>
                <IconButton color="primary" onClick={onExportDiagram} aria-label="save">
                    <SaveAltIcon/>
                </IconButton>
            </div>
            <Divider/>

            <Typography variant="h5" gutterBottom>Edit Event</Typography>
            <ShapeToolPane data={shapeToolData} onEventUpdated={onEventUpdated}/>
            <Divider/>

            {
                shapeToolData && shapeToolData.eventType !== EventType.INTERMEDIATE &&
                <React.Fragment>
                    <Typography variant="h5" gutterBottom>Failure Modes</Typography>
                    <Button color="primary" onClick={() => setFailureModeDialogOpen(true)}>
                        Create Failure Mode
                    </Button>
                </React.Fragment>
            }

            <FailureModeDialog open={failureModeDialogOpen && Boolean(shapeToolData)}
                               onClose={() => setFailureModeDialogOpen(false)}
                               leafEventIri={shapeToolData?.iri}/>
        </Paper>
    );
}

export default SidebarMenu;