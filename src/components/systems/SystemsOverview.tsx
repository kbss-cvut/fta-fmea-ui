import React, { useState } from "react";
import DashboardSystemList from "@components/dashboard/content/list/DashboardSystemList";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import { Typography, Button, Box } from "@mui/material";
import SystemDialog from "@components/dialog/system/SystemDialog";
import OverviewContainer from "../../components/layout/OverviewContainer";
import { useTranslation } from "react-i18next";

const SystemsOverview = () => {
  const { t } = useTranslation();

  const [createSystemDialogOpen, setCreateSystemDialogOpen] = useState<boolean>(false);

  const handleDialogOpen = () => {
    setCreateSystemDialogOpen(true);
  };

  return (
    <DashboardContentProvider>
      <OverviewContainer>
        {/* TODO: Add to sep. component */}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h5">{t("categories.systems")}</Typography>
          <Button variant="contained" onClick={handleDialogOpen}>
            {t("create.system")}
          </Button>
        </Box>

        <DashboardSystemList />
        <SystemDialog open={createSystemDialogOpen} handleCloseDialog={() => setCreateSystemDialogOpen(false)} />
      </OverviewContainer>
    </DashboardContentProvider>
  );
};

export default SystemsOverview;
