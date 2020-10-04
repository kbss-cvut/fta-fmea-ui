import * as React from "react";
import {createMuiTheme, ThemeOptions} from "@material-ui/core";

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        appDrawer: {
            width: React.CSSProperties['width']
        }
    }
    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        appDrawer?: {
            width?: React.CSSProperties['width']
        }
    }
}

const createCustomMuiTheme = (options: ThemeOptions) => {
    return createMuiTheme({
        ...options,
    })
}

export default createCustomMuiTheme;