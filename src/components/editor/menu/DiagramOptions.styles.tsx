import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  menuTitle: {
    backgroundColor: "#1976D256",
    marginRight: "-16px",
    paddingLeft: "8px",
    borderBottom: "inset",
  },
}));

export default useStyles;
