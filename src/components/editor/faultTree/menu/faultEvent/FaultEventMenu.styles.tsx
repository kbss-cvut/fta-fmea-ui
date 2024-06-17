import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  label: {
    fontWeight: "500",
    marginRight: 8,
    fontSize: 16,
    color: "black",
  },
  labelRow: {
    color: "grey",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  selected: {
    color: "black",
    "&.Mui-checked": {
      color: "black",
    },
  },
  notSelected: {
    color: "grey",
    "&.Mui-checked": {
      color: "grey",
    },
  },
  editable: {
    color: "black",
  },
  notEditable: {
    color: "grey",
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
  },
  numberInput: {
    "& .MuiInputBase-input": {
      color: "black",
      padding: "8px 12px",
    },
  },
}));

export default useStyles;
