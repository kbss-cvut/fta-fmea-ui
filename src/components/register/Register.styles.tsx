import {Theme} from "@mui/material";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) =>
    ({
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
            marginTop: theme.spacing(3),
        },

        submit: {
            margin: theme.spacing(3, 0, 2),
        },

        alert: {
            marginTop: theme.spacing(2)
        }
    }));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;