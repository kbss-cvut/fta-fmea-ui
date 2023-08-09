import {Theme} from "@mui/material";
import {makeStyles,createStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divForm: {
            flexGrow: 1
        },
        newEventTitle: {
            margin: theme.spacing(1, 0)
        },
        formControlDiv: {
            width: '100%',
        },
        formControl: {
            minWidth: 120,
            margin: theme.spacing(1, 0)
        },
        probability: {
            minWidth: 120,
        },
        sequenceProbability: {
            marginLeft: theme.spacing(1),
            minWidth: 160,
        }
    }),
);

export default useStyles;
