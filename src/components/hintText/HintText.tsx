import React from "react";
import { Tooltip } from "@mui/material";
import useStyles from "./HintText.styles";
import { HelpOutline } from "@mui/icons-material";

interface HintTextProps {
  text: string;
  hint: string;
}

const HintText: React.FC<HintTextProps> = ({ hint }) => {
  const { classes } = useStyles();
  return (
    <Tooltip title={<span className={classes.hintFont}>{hint}</span>} arrow placement="bottom">
      <HelpOutline className={classes.helpIcon} />
    </Tooltip>
  );
};

export default HintText;
