import React, { useState } from "react";
import DashboardFaultTreeList from "@components/dashboard/content/list/DashboardFaultTreeList";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import { Typography, Box, Button } from "@mui/material";
import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";
import OverviewContainer from "../../components/layout/OverviewContainer";
import { useTranslation } from "react-i18next";
import FaultTreeOverview from "../dashboard/content/list/FaultTreeOverview";

const FtaOverview = () => {
  const { t } = useTranslation();

  const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState<boolean>(false);

  const handleDialogOpen = () => {
    setCreateFaultTreeDialogOpen(true);
  };

  return (
    <DashboardContentProvider>
      <OverviewContainer>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h5">{t("categories.trees")}</Typography>
          <Button variant="contained" onClick={handleDialogOpen}>
            {t("create.tree")}
          </Button>
        </Box>

        <FaultTreeOverview />
        <FaultTreeDialog
          open={createFaultTreeDialogOpen}
          handleCloseDialog={() => setCreateFaultTreeDialogOpen(false)}
        />
      </OverviewContainer>
    </DashboardContentProvider>
  );
};

export default FtaOverview;
