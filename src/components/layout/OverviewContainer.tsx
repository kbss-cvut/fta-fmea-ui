import React from "react";
import { Box } from "@mui/material";

const OverviewContainer = ({ children }) => {
  return (
    <Box marginTop={3} marginLeft={2} marginRight={2}>
      {children}
    </Box>
  );
};

export default OverviewContainer;
