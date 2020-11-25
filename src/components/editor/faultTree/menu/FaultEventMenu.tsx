import {Button, Divider, Paper, Typography} from "@material-ui/core";
import ShapeToolPane from "./ShapeToolPane";
import {EventType, FaultEvent} from "@models/eventModel";
import * as React from "react";
import FailureModeDialog from "../../../dialog/failureMode/create/FailureModeDialog";
import {useState} from "react";
import {EventFailureModeProvider, useEventFailureMode} from "@hooks/useEventFailureMode";
import EventFailureModeList from "@components/editor/faultTree/menu/failureMode/EventFailureModeList";

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
                shapeToolData &&
                <EventFailureModeProvider eventIri={shapeToolData?.iri}>
                    <Typography variant="h5" gutterBottom>Failure Mode</Typography>
                    <EventFailureModeList/>

                    <Button color="primary" onClick={() => setFailureModeDialogOpen(true)}>
                        Set Failure Mode
                    </Button>

                    <FailureModeDialog open={failureModeDialogOpen && Boolean(shapeToolData)}
                                       onClose={() => setFailureModeDialogOpen(false)}
                                       eventIri={shapeToolData?.iri}/>
                </EventFailureModeProvider>
            }
        </React.Fragment>
    );
}

export default FaultEventMenu;