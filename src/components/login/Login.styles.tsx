import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        alert: {
            marginTop: theme.spacing(2)
        },
        footer: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100vw',
            left: 0,
            bottom: '5%'
        },
        logo: {
            objectFit: 'contain'
        }
    }),
);

export default useStyles;