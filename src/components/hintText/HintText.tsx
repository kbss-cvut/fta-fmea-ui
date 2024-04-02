import React from "react";
import { Typography, IconButton, Tooltip } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import useStyles from "./HintText.styles";

interface HintTextProps {
  text: string;
  hint: string;
}

const HintText: React.FC<HintTextProps> = ({ text, hint }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <Typography variant="body1">{text}</Typography>
        <div className={classes.toolTip}>
          <Tooltip title={hint} arrow placement="bottom">
            <IconButton size="small" aria-label="hint">
              <QuestionMarkIcon className={classes.hintFont} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default HintText;
