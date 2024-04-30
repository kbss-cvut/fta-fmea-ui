import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
  grid: {
    marginTop: 0,
  },
  cardContainer: {
    minWidth: 280,
    display: "flex",
    flexDirection: "column",
    borderRadius: 4,
    transition: "border-color 0.3s ease",
  },
  cardHalfContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    userSelect: "none",
  },
}));

export default useStyles;
