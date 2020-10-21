import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => {
        const w = window.innerWidth

        return createStyles({
            drawerHeader: {
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                // necessary for content to be below app bar
                ...theme.mixins.toolbar,
                justifyContent: 'flex-end',
            },
            stage: {
                width: `calc(${w}px - ${theme.appDrawer.width}px)`
            }
        })
    }
);

export default useStyles;