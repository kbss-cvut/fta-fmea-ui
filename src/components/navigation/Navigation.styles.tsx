import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    display: "block",
    alignItems: "stretch",
    height: "100vh",
    overflow: "hidden",
  },
  childrenContainer: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flex: "1",
    zIndex: 1,
    backgroundColor: "white",
  },
}));

export default useStyles;
