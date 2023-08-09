import {Theme} from "@mui/material";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) =>
    ({
        rpnBox: {
            padding: theme.spacing(0, 1),
            display: 'flex',
            gap: '0.5em'
        },

        mitigationBox : {
            padding: theme.spacing(0, 1),
            display: 'flex',
            gap: '0.5em',
            marginTop: '3%'
        },

        rpnBoxItem: {
            flexGrow: 1,
        }
    }));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
