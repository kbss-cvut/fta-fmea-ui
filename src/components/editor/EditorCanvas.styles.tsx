import {Theme} from "@mui/material/";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => {
        return {
            root: {
                flexGrow: 1,
                display: 'flex',
            },
            konvaContainer: {
                height: 'calc(100vh - 64px)',
                flexGrow: 7,
            },
            sidebar: {
                height: 'calc(100vh - 64px)',
                overflow: 'hidden',
                flexGrow: 3,
                width: '30%',
            }
        };
    });

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;