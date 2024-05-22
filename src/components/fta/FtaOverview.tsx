import React from "react";
import OverviewContainer from "../../components/layout/OverviewContainer";
import FaultTreeOverview from "../dashboard/content/list/FaultTreeOverview";

const FtaOverview = () => {
  return (
    <OverviewContainer>
      <FaultTreeOverview />
    </OverviewContainer>
  );
};

export default FtaOverview;
