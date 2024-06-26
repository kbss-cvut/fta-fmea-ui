import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  label: {
    fontWeight: "500",
    marginRight: 8,
    fontSize: 16,
    color: theme.main.black,
  },
  labelRow: {
    color: theme.main.grey,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  selected: {
    color: theme.main.black,
    "&.Mui-checked": {
      color: theme.main.black,
    },
  },
  notSelected: {
    color: theme.main.grey,
    "&.Mui-checked": {
      color: theme.main.grey,
    },
  },
  editableValue: {
    color: theme.main.black,
  },
  notEditableValue: {
    color: theme.main.grey,
  },
  outdated: {
    color: "red",
    "&.Mui-checked": {
      color: theme.main.red,
    },
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
  },
  numberInput: {
    "& .MuiInputBase-input": {
      color: theme.main.black,
      padding: "8px 12px",
    },
  },
}));

export default useStyles;
