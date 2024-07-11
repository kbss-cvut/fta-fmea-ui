import React, { FC, useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface FaultTreeFiltersProps {
  onFilterChange: (label: string, snsLabel: string) => void;
}

const FaultTreeFilters: FC<FaultTreeFiltersProps> = ({ onFilterChange }) => {
  const [label, setLabel] = useState<string>("");
  const [snsLabel, setSnsLabel] = useState<string>("");

  const handleFilterChange = () => {
    onFilterChange(label, snsLabel);
  };

  return (
    <Box display="flex" alignItems="center" mb={2}>
      <TextField
        label="FHA Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        variant="outlined"
        style={{ marginRight: 8 }}
      />
      <TextField
        label="SNS Label"
        value={snsLabel}
        onChange={(e) => setSnsLabel(e.target.value)}
        variant="outlined"
        style={{ marginRight: 8 }}
      />
      <Button variant="contained" color="primary" onClick={handleFilterChange}>
        Apply Filters
      </Button>
    </Box>
  );
};

export default FaultTreeFilters;
