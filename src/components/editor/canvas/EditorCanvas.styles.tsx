import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            konvaContainer: {
                marginTop: theme.spacing(1),
                display: 'flex',
                height: `100%`,
                flexGrow: 7,
            },
            divWindowTool: {
                padding: theme.spacing(1, 0, 0, 1),
                height: '100%',
                overflow: 'hidden',
                flexGrow: 3,
            }
        })
    }
);

export default useStyles;