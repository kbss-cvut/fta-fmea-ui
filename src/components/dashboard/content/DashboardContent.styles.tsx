import { makeStyles } from 'tss-react/mui';
import {Theme} from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => {
        return {
            root: {
                flexGrow: 1,
                padding: theme.spacing(3)
            },
            speedDial: {
                position: 'fixed',
                bottom: theme.spacing(2),
                right: theme.spacing(2),
            },
            backdrop: {
                zIndex: 5,
            }
        };
    });

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;