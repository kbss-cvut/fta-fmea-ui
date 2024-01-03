import * as React from "react";
import { adaptV4Theme } from '@mui/material/styles';
import {createMuiTheme, DeprecatedThemeOptions} from "@mui/material";
import {createTheme} from "@mui/material/styles";

declare module '@mui/material/styles' {
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
    interface DeprecatedThemeOptions {
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

const createCustomMuiTheme = (options: DeprecatedThemeOptions) => {
    return createTheme(adaptV4Theme({
        ...options,
    }));
}

export default createCustomMuiTheme;