import { makeStyles } from "@mui/material";
import { createStyles, Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButtonDiv: {
      display: "inline-flex",
      width: "100%",
    },
    addButton: {
      alignSelf: "flex-end",
    },
    autocomplete: {
      marginTop: theme.spacing(3),
    },
  }),
);

export default useStyles;
