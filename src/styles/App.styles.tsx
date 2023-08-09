import {createMuiTheme} from "@mui/material";
import createCustomMuiTheme from "@styles/App.styles.declarations";

const _defaultTheme = createMuiTheme();
export const appTheme = createCustomMuiTheme({
    appDrawer: {
        width: 240
    },
    editor: {
        shape: {
            padding: _defaultTheme.spacing(2) as unknown as number,
            strokeWidth: 1,
            strokeColor: 'black'
        },
        fontSize: 15
    }
});