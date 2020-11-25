import * as React from "react";
import useStyles from "@components/dashboard/content/DashboardContent.styles";
import {Divider, Typography} from "@material-ui/core";

import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";
import {useState} from "react";
import DashboardFaultTreeList from "@components/dashboard/content/list/DashboardFaultTreeList";
import DashboardFailureModeList from "@components/dashboard/content/list/DashboardFailureModeList";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@material-ui/lab";
import FlightIcon from '@material-ui/icons/Flight';
import NatureIcon from '@material-ui/icons/Nature';
import DashboardSystemList from "@components/dashboard/content/list/DashboardSystemList";
import SystemDialog from "@components/dialog/system/SystemDialog";

const DashboardContent = () => {
    const classes = useStyles();

    const [speedDialOpen, setSpeedDialOpen] = React.useState(false);

    const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState(false)
    const closeTreeDialog = () => setCreateFaultTreeDialogOpen(false)

    const [createSystemDialogOpen, setCreateSystemDialogOpen] = useState(false)
    const closeSystemDialog = () => setCreateSystemDialogOpen(false)

    const handleNewFaultTree = () => {
        setSpeedDialOpen(false);
        setCreateFaultTreeDialogOpen(true);
    }

    const handleNewSystem = () => {
        setSpeedDialOpen(false);
        setCreateSystemDialogOpen(true);
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
                <DashboardFailureModeList/>
            </div>

            <SpeedDial
                ariaLabel="SpeedDial Dashboard"
                className={classes.speedDial}
                icon={<SpeedDialIcon/>}
                onClose={() => setSpeedDialOpen(false)}
                onOpen={() => setSpeedDialOpen(true)}
                open={speedDialOpen}
            >
                <SpeedDialAction key="speed-dial-action-new-tree" icon={<NatureIcon/>} tooltipOpen
                                 tooltipTitle={"Fault Tree"} title={"Fault Tree"}
                                 onClick={handleNewFaultTree}/>
                <SpeedDialAction key="speed-dial-action-new-system" icon={<FlightIcon/>} tooltipOpen
                                 tooltipTitle={"System"} title={"System"}
                                 onClick={handleNewSystem}/>
            </SpeedDial>

            <FaultTreeDialog open={createFaultTreeDialogOpen} handleCloseDialog={closeTreeDialog}/>
            <SystemDialog open={createSystemDialogOpen} handleCloseDialog={closeSystemDialog}/>
        </React.Fragment>
    );
}

export default DashboardContent;