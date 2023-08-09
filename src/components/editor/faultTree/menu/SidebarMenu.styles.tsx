import {Theme} from "@mui/material";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) =>
    ({
        paper: {
            height: '100%',
            padding: theme.spacing(1)
        }
    }));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;