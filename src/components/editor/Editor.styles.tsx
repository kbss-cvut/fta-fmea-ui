import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => {
    const appBarHeight = 64
        return createStyles({
            konvaContainer: {
                height: `calc(100% - ${2 * appBarHeight}px)`,
                width: '100%',
            },
        })
    }
);

export default useStyles;