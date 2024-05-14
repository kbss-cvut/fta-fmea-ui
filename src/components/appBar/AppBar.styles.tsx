import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  languageToggler: {
    cursor: "pointer",
    marginLeft: 8,
    marginRight: 8,
    display: "flex",
    alignItems: "center",
    maxHeight: 24,
    userSelect: "none",
  },
  languageIcon: {
    fontSize: 16,
    marginRight: 2,
  },
  languageLabel: {
    width: 24,
  },
  textfieldContainer: {
    minWidth: 120,
  },
  textfieldSelect: {
    marginRight: 8,
    minWidth: 160,
    "& .MuiSelect-icon": {
      color: theme.button.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.button.secondary,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.button.secondary,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.button.secondary,
        borderWidth: 1,
      },
    },
    "& .MuiInputBase-input": {
      color: theme.button.secondary,
      padding: "8px 12px",
    },
    "& .MuiInputLabel-root": {
      color: "transparent",
    },
  },
  inputLabel: {
    color: theme.button.secondary,
    "&.Mui-focused": {
      color: theme.button.secondary,
    },
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: 12,
    pointerEvents: "none",
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  tooltipContainer: {
    height: 24,
    width: 24,
  },
  tooltip: {
    cursor: "pointer",
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
