import {Button, Divider, Paper, Typography} from "@material-ui/core";
import ShapeToolPane from "./ShapeToolPane";
import {EventType, FaultEvent} from "@models/eventModel";
import * as React from "react";
import FailureModeDialog from "../../../dialog/failureMode/create/FailureModeDialog";
import {useState} from "react";

interface Props {
    shapeToolData?: FaultEvent,
    onEventUpdated: (faultEvent: FaultEvent) => void,
}

const FaultEventMenu = ({shapeToolData, onEventUpdated}: Props) => {
    const [failureModeDialogOpen, setFailureModeDialogOpen] = useState(false);

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
}

export default FaultEventMenu;