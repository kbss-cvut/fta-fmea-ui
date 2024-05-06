import React from "react";
import DashboardContentProvider from "../../hooks/DashboardContentProvider";
import OverviewContainer from "../layout/OverviewContainer";
import { useTranslation } from "react-i18next";

const FhaOverview = () => {
  const { t } = useTranslation();

  return (
    <DashboardContentProvider>
      <OverviewContainer>{/* Component is empty for now */}</OverviewContainer>
    </DashboardContentProvider>
  );
};

export default FhaOverview;
