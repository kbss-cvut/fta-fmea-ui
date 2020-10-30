import * as React from "react";
import {createMuiTheme, ThemeOptions} from "@material-ui/core";

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        appDrawer: {
            width: React.CSSProperties['width']
        },
        editor?: {
            shape?: {
                padding?: number
                strokeWidth?: number,
                strokeColor?: React.CSSProperties['color']
            }
            fontSize: number
        }
    }
    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        appDrawer?: {
            width?: React.CSSProperties['width']
        },
        editor?: {
            shape?: {
                padding?: number,
                strokeWidth?: number,
                strokeColor?: React.CSSProperties['color']
            }
            fontSize: number
        }
    }
}

const createCustomMuiTheme = (options: ThemeOptions) => {
    return createMuiTheme({
        ...options,
    })
}

export default createCustomMuiTheme;