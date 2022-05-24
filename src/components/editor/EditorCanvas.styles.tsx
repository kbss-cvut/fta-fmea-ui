import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            multiEditorRoot:{
                position: "relative"
            },
            root: {
                flexGrow: 1,
                display: 'flex',
            },
            rootHidden: {
                flexGrow: 1,
                visibility: 'hidden',
                position: 'absolute',
                zIndex:-10
            },
            hidden:{
                visibility: 'hidden',
                position: 'absolute',
                zIndex:10
            },
            hiddenKonvaContainer:{
                marginTop: theme.spacing(1),
                height: `100%`,
                flexGrow: 7,
                visibility: 'hidden',
                position: 'absolute',
                zIndex:-11
            },
            konvaContainer: {
                marginTop: theme.spacing(1),
                height: `100%`,
                flexGrow: 7,
            },
            hiddenTreeContainer:{
                marginTop: theme.spacing(1),
                height: `100%`,
                flexGrow: 7,
                display: 'none',
                visibility: 'hidden',
                position: 'absolute',
                zIndex:11
            },
            treeContainer: {
                marginTop: theme.spacing(1),
                height: `100%`,
                flexGrow: 7,
            },
            sidebar: {
                padding: theme.spacing(1, 0, 0, 1),
                height: '100%',
                overflow: 'hidden',
                flexGrow: 3,
                maxWidth: '30%',
                minWidth: '30%',
            },
            sidebarHidden: {
                padding: theme.spacing(1, 0, 0, 1),
                height: '100%',
                overflow: 'hidden',
                flexGrow: 3,
                maxWidth: '30%',
                minWidth: '30%',
            }
        })
    }
);

export default useStyles;