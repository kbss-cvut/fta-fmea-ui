import * as React from "react";
import useStyles from "@components/dashboard/content/DashboardContent.styles";
import {Divider, Typography} from "@mui/material";

import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";
import {useState} from "react";
import DashboardFaultTreeList from "@components/dashboard/content/list/DashboardFaultTreeList";
import DashboardFailureModesTableList from "@components/dashboard/content/list/DashboardFailureModesTableList";
import {SpeedDial, SpeedDialIcon} from "@mui/lab";
import {SpeedDialAction} from "@mui/material";
import FlightIcon from '@mui/icons-material/Flight';
import NatureIcon from '@mui/icons-material/Nature';
import DashboardSystemList from "@components/dashboard/content/list/DashboardSystemList";
import SystemDialog from "@components/dialog/system/SystemDialog";
import TableChartIcon from "@mui/icons-material/TableChart";
import FailureModesTableAggregateDialog
    from "@components/dialog/failureModesTable/aggregate/FailureModesTableAggregateDialog";

const DashboardContent = () => {
    const { classes } = useStyles();

    const [speedDialOpen, setSpeedDialOpen] = React.useState(false);

    const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState(false);
    const [createSystemDialogOpen, setCreateSystemDialogOpen] = useState(false);
    const [createFmeaAggregateDialogOpen, setCreateFmeaAggregateDialogOpen] = useState(false);

    const handleNewFaultTree = () => {
        setSpeedDialOpen(false);
        setCreateFaultTreeDialogOpen(true);
    }

    const handleNewSystem = () => {
        setSpeedDialOpen(false);
        setCreateSystemDialogOpen(true);
    }

    const handleNewFmeaAggregate = () => {
        setSpeedDialOpen(false);
        setCreateFmeaAggregateDialogOpen(true);
    }

    return (
        <React.Fragment>
            <div className={classes.root}>
                <Typography variant="h5">Systems</Typography>
                <Divider/>
                <DashboardSystemList/>

                <Typography variant="h5">Fault Trees</Typography>
                <Divider/>
                <DashboardFaultTreeList/>

                <Typography variant="h5">FMEA Worksheets</Typography>
                <Divider/>
                <DashboardFailureModesTableList/>
            </div>

            <SpeedDial
                ariaLabel="SpeedDial Dashboard"
                className={classes.speedDial}
                icon={<SpeedDialIcon/>}
                onClose={() => setSpeedDialOpen(false)}
                onOpen={() => setSpeedDialOpen(true)}
                open={speedDialOpen}
            >
                <SpeedDialAction key="speed-dial-action-new-table-aggregate" icon={<TableChartIcon/>} tooltipOpen
                                 tooltipTitle={"Aggregated FMEA"} title={"Aggregated FMEA"}
                                 onClick={handleNewFmeaAggregate}/>
                <SpeedDialAction key="speed-dial-action-new-tree" icon={<NatureIcon/>} tooltipOpen
                                 tooltipTitle={"Fault Tree"} title={"Fault Tree"}
                                 onClick={handleNewFaultTree}/>
                <SpeedDialAction key="speed-dial-action-new-system" icon={<FlightIcon/>} tooltipOpen
                                 tooltipTitle={"System"} title={"System"}
                                 onClick={handleNewSystem}/>
            </SpeedDial>

            <FaultTreeDialog open={createFaultTreeDialogOpen}
                             handleCloseDialog={() => setCreateFaultTreeDialogOpen(false)}/>
            <SystemDialog open={createSystemDialogOpen} handleCloseDialog={() => setCreateSystemDialogOpen(false)}/>
            <FailureModesTableAggregateDialog open={createFmeaAggregateDialogOpen}
                                              onClose={() => setCreateFmeaAggregateDialogOpen(false)}/>
        </React.Fragment>
    );
}

export default DashboardContent;