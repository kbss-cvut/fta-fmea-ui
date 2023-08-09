import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles(() =>
    createStyles({
        functions: {
            width: "100%",
        },
        button: {
            alignSelf: "flex-end",
        },
        editHeader: {
            display: "flex",
            justifyContent: "space-between",
        },
        closure: {
            color: "#A9A9A9"
        },
        menuPaper: {
            maxHeight: 500,
            maxWidth: 300
        }
    })
);

export default useStyles;
