import React from "react";
import { Box, Button, Typography } from "@mui/material";
import DashboardContentProvider from "../../hooks/DashboardContentProvider";
import OverviewContainer from "../layout/OverviewContainer";
import { useTranslation } from "react-i18next";

const FhaOverview = () => {
  const { t } = useTranslation();

  return (
    <DashboardContentProvider>
      <OverviewContainer>
        {/* Component is empty for now */}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h5">{t("categories.tables")}</Typography>
        </Box>
      </OverviewContainer>
    </DashboardContentProvider>
  );
};

export default FhaOverview;
