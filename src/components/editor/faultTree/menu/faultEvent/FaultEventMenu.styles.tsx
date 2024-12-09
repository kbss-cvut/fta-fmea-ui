import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  label: {
    fontWeight: "500",
    marginRight: 8,
    fontSize: 16,
    color: theme.main.black,
    whiteSpace: "nowrap",
  },
  eventPropertyRow: {
    color: theme.main.grey,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: "1rem",
    width: "100%",
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
    color: theme.notSynchronized.color,
    alignItems: "baseline",
    "&.Mui-checked": {
      color: theme.notSynchronized.color,
    },
  },
  violated: {
    color: theme.requirementViolation.color,
    alignItems: "baseline",
    "&.Mui-checked": {
      color: theme.requirementViolation.color,
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
  hint: {
    fontSize: 16,
  },
}));

export default useStyles;
