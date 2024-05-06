import React from "react";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import OverviewContainer from "../../components/layout/OverviewContainer";
import FaultTreeOverview from "../dashboard/content/list/FaultTreeOverview";

const FtaOverview = () => {
  return (
    <DashboardContentProvider>
      <OverviewContainer>
        <FaultTreeOverview />
      </OverviewContainer>
    </DashboardContentProvider>
  );
};

export default FtaOverview;
