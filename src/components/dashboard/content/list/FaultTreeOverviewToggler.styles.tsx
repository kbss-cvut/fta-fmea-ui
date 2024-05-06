import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
  iconContainer: {
    height: 36,
    width: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: 2,
    marginLeft: 8,
  },
  togglerContainer: {
    display: "flex",
  },
}));
export default useStyles;
