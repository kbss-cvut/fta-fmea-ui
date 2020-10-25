import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menu: {
            display: 'flex',
            flexDirection: 'column'
        },
        componentButton: {
            margin: theme.spacing(2, 2, 0)
        },
    })
);

export default useStyles;