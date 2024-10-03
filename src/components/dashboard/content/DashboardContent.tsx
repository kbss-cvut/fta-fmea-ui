import * as React from "react";
import useStyles from "@components/dashboard/content/DashboardContent.styles";
import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";
import { useState } from "react";
import { SpeedDial, SpeedDialIcon } from "@mui/material";
import { SpeedDialAction } from "@mui/material";
import NatureIcon from "@mui/icons-material/Nature";
import SystemDialog from "@components/dialog/system/SystemDialog";
import TableChartIcon from "@mui/icons-material/TableChart";
import FailureModesTableAggregateDialog from "@components/dialog/failureModesTable/aggregate/FailureModesTableAggregateDialog";
import { ENVVariable } from "../../../utils/constants";

const DashboardContent = () => {
  const { classes } = useStyles();

  const [speedDialOpen, setSpeedDialOpen] = React.useState(false);

  const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState(false);
  const [createSystemDialogOpen, setCreateSystemDialogOpen] = useState(false);
  const [createFmeaAggregateDialogOpen, setCreateFmeaAggregateDialogOpen] = useState(false);

  const handleNewFaultTree = () => {
    setSpeedDialOpen(false);
    setCreateFaultTreeDialogOpen(true);
  };

  const handleNewSystem = () => {
    setSpeedDialOpen(false);
    setCreateSystemDialogOpen(true);
  };

  const handleNewFmeaAggregate = () => {
    setSpeedDialOpen(false);
    setCreateFmeaAggregateDialogOpen(true);
  };

  return (
    <React.Fragment>
      <SpeedDial
        ariaLabel="SpeedDial Dashboard"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
      >
        {!ENVVariable.DISABLE_FMEA && (
          <SpeedDialAction
            key="speed-dial-action-new-table-aggregate"
            icon={<TableChartIcon />}
            tooltipOpen
            tooltipTitle={"Aggregated FMEA"}
            title={"Aggregated FMEA"}
            onClick={handleNewFmeaAggregate}
          />
        )}
        <SpeedDialAction
          key="speed-dial-action-new-tree"
          icon={<NatureIcon />}
          tooltipOpen
          tooltipTitle={"Fault Tree"}
          title={"Fault Tree"}
          onClick={handleNewFaultTree}
        />
        <SpeedDialAction
          key="speed-dial-action-new-system"
          icon={<FlightIcon />}
          tooltipOpen
          tooltipTitle={"System"}
          title={"System"}
          onClick={handleNewSystem}
        />
      </SpeedDial>

      <FaultTreeDialog open={createFaultTreeDialogOpen} handleCloseDialog={() => setCreateFaultTreeDialogOpen(false)} />
      <SystemDialog open={createSystemDialogOpen} handleCloseDialog={() => setCreateSystemDialogOpen(false)} />
      {!ENVVariable.DISABLE_FMEA && (
        <FailureModesTableAggregateDialog
          open={createFmeaAggregateDialogOpen}
          onClose={() => setCreateFmeaAggregateDialogOpen(false)}
        />
      )}
    </React.Fragment>
  );
};

export default DashboardContent;
