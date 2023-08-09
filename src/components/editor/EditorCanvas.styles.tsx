import {Theme} from "@mui/material/";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => {
        return {
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
        };
    });

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;