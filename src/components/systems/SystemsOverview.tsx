import React from "react";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import OverviewContainer from "../../components/layout/OverviewContainer";
import SystemOverview from "../dashboard/content/list/SystemOverview";

const SystemsOverview = () => {
  return (
    <DashboardContentProvider>
      <OverviewContainer>
        <SystemOverview />
      </OverviewContainer>
    </DashboardContentProvider>
  );
};

export default SystemsOverview;
