import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            root: {
                flexGrow: 1,
                display: 'flex',
            },
            konvaContainer: {
                marginTop: theme.spacing(1),
                height: `100%`,
                flexGrow: 7,
            },
            sidebar: {
                padding: theme.spacing(1, 0, 0, 1),
                height: '100%',
                overflow: 'hidden',
                flexGrow: 3,
                maxWidth: '30%',
                minWidth: '30%',
            }
        })
    }
);

export default useStyles;