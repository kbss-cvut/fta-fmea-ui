import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    position: "fixed",
    backgroundColor: "#FBFAFC",
    height: "100vh",
    zIndex: 1,
  },
  menuItem: {
    height: 70,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
  },
  iconContainer: {
    height: 24,
    width: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 0.5,
    userSelect: "none",
  },
  hint: {
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.25,
    userSelect: "none",
  },
}));

export default useStyles;
