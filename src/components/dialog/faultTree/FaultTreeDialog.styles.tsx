import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => {
  return {
    readOnly: {
      opacity: "50%",
      border: "none",
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(0, 0, 0, 0.6)",
        borderWidth: 0.5,
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "rgba(0, 0, 0, 0.6)",
      },
    },
  };
});

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
