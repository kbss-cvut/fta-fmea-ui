import { makeStyles } from 'tss-react/mui';
import {Theme} from "@mui/material";

const useStyles = makeStyles()((theme: Theme) =>
    ({
        title: {
            flexGrow: 1,
        },

        menuButton: {
            marginRight: theme.spacing(2),
        }
    }));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;