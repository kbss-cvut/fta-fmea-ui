import {Theme} from "@mui/material";
import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        },
    }),
);

export default useStyles;
