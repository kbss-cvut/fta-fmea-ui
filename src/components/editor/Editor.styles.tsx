import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => {
        const appBarHeight = 64
        return createStyles({
            konvaContainer: {
                marginTop: theme.spacing(1),
                display: 'flex',
                height: `calc(100% - ${2 * appBarHeight}px)`,
                width: '100%',
            },
            divWindowTool: {
                padding: theme.spacing(1, 0, 1, 1),
                zIndex: 5,
                height: '100%',
                alignSelf: 'flex-end',
                width: theme.appDrawer.width,
                overflow: 'hidden',
            }
        })
    }
);

export default useStyles;