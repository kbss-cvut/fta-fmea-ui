import React, { useState } from "react";
import DashboardFaultTreeList from "@components/dashboard/content/list/DashboardFaultTreeList";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import { Typography, Box, Button } from "@mui/material";
import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";
import OverviewContainer from "../../components/layout/OverviewContainer";

const FtaOverview = () => {
  const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState<boolean>(false);

  const handleDialogOpen = () => {
    setCreateFaultTreeDialogOpen(true);
  };

  return (
    <DashboardContentProvider>
      <OverviewContainer>
        {/* TODO: Add to sep. component */}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h5">Fault Trees</Typography>
          <Button variant="contained" onClick={handleDialogOpen}>
            New Fault tree
          </Button>
        </Box>

        <DashboardFaultTreeList />
        <FaultTreeDialog
          open={createFaultTreeDialogOpen}
          handleCloseDialog={() => setCreateFaultTreeDialogOpen(false)}
        />
      </OverviewContainer>
    </DashboardContentProvider>
  );
};

export default FtaOverview;
