import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) => {
        const appBarHeight = 64
        return createStyles({
            tabPanelDiv: {
                height: `calc(100vh - ${2 * appBarHeight}px)`,
            },
        })
    }
);