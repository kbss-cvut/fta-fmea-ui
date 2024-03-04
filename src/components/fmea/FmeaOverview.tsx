import React, { useState } from "react";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import { Box, Button, Typography } from "@mui/material";
import DashboardFailureModesTableList from "@components/dashboard/content/list/DashboardFailureModesTableList";
import FailureModesTableAggregateDialog from "@components/dialog/failureModesTable/aggregate/FailureModesTableAggregateDialog";
import OverviewContainer from "../../components/layout/OverviewContainer";

const FmeaOverview = () => {
  const [createFmeaAggregateDialogOpen, setCreateFmeaAggregateDialogOpen] = useState<boolean>(false);

  const handleDialogOpen = () => {
    setCreateFmeaAggregateDialogOpen(true);
  };

  return (
    <DashboardContentProvider>
      <OverviewContainer>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h5">Fault Trees</Typography>
          <Button variant="contained" onClick={handleDialogOpen}>
            New fmea worksheet
          </Button>
        </Box>

        <DashboardFailureModesTableList />
        <FailureModesTableAggregateDialog
          open={createFmeaAggregateDialogOpen}
          onClose={() => setCreateFmeaAggregateDialogOpen(false)}
        />
      </OverviewContainer>
    </DashboardContentProvider>
  );
};

export default FmeaOverview;
