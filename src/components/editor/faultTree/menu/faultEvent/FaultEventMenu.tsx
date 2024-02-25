import { Button, Divider, Paper, Typography } from "@mui/material";
import FaultEventShapeToolPane from "./FaultEventShapeToolPane";
import { EventType, FaultEvent } from "../../../../../models/eventModel";
import * as React from "react";
import FailureModeDialog from "../../../../dialog/failureMode/create/FailureModeDialog";
import { useState } from "react";
import { EventFailureModeProvider, useEventFailureMode } from "../../../../../hooks/useEventFailureMode";
import EventFailureModeList from "../failureMode/EventFailureModeList";
import { FailureMode } from "../../../../../models/failureModeModel";
import FailureModeShowDialog from "../../../../dialog/failureMode/show/FailureModeShowDialog";

interface Props {
  shapeToolData?: FaultEvent;
  onEventUpdated: (faultEvent: FaultEvent) => void;
  refreshTree: () => void;
}

const FaultEventMenu = ({ shapeToolData, onEventUpdated, refreshTree }: Props) => {
  const [failureModeDialogOpen, setFailureModeDialogOpen] = useState(false);

  const [failureModeOverviewDialogOpen, setFailureModeOverviewDialogOpen] = useState(false);
  const [failureModeOverview, setFailureModeOverview] = useState<FailureMode | null>(null);

  const handleFailureModeClicked = (failureMode: FailureMode) => {
    setFailureModeOverview(failureMode);
    setFailureModeOverviewDialogOpen(true);
  };

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Edit Event
      </Typography>
      <FaultEventShapeToolPane data={shapeToolData} onEventUpdated={onEventUpdated} refreshTree={refreshTree} />
      <Divider />

      {shapeToolData && (
        <EventFailureModeProvider eventIri={shapeToolData?.iri}>
          <Typography variant="h5" gutterBottom>
            Failure Mode
          </Typography>
          <EventFailureModeList onFailureModeClick={handleFailureModeClicked} />

          <Button color="primary" onClick={() => setFailureModeDialogOpen(true)}>
            Set Failure Mode
          </Button>

          <FailureModeDialog
            open={failureModeDialogOpen && Boolean(shapeToolData)}
            onClose={() => setFailureModeDialogOpen(false)}
            eventIri={shapeToolData?.iri}
          />

          <FailureModeShowDialog
            open={failureModeOverviewDialogOpen}
            failureMode={failureModeOverview}
            onClose={() => setFailureModeOverviewDialogOpen(false)}
          />
        </EventFailureModeProvider>
      )}
    </React.Fragment>
  );
};

export default FaultEventMenu;
