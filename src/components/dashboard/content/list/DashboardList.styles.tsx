import {createStyles, makeStyles} from "@mui/styles";
import {Theme} from "@mui/material"

const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            gridList: {
                padding: theme.spacing(1, 0, ),
                height: 'auto',
            },
            gridListTile: {
                height: '100% !important',
            },
            card: {
                margin: theme.spacing(1),
            },
            cardTitle: {
                overflow: 'hidden'
            }
        })
    }
);

export default useStyles;