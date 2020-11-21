import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
    }),
);

export default useStyles;