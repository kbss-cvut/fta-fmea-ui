import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { COLOR } from "@utils/constants";

declare module "@mui/material/styles" {
  interface Theme {
    appDrawer: {
      width: React.CSSProperties["width"];
    };
    editor?: {
      shape?: {
        padding?: number;
        strokeWidth?: number;
        strokeColor?: React.CSSProperties["color"];
      };
      fontSize: number;
    };
    sidePanel?: {
      colors?: {
        icon?: string;
        iconActive?: string;
        text?: string;
        textActive?: string;
        hint?: string;
        hover?: string;
      };
    };
    dashboard?: {
      colors?: {
        active?: string;
        activeIcon?: string;
      };
    };
    button?: {
      primary?: string;
      secondary?: string;
    };
    main?: {
      black: string;
      grey: string;
      red: string;
      orange: string;
      notSynchronized?: {
        color: COLOR;
      };
      synchronized?: {
        color: COLOR;
      };
    };
  }
  // allow configuration using `createMuiTheme`
  interface DeprecatedThemeOptions {
    appDrawer?: {
      width?: React.CSSProperties["width"];
    };
    editor?: {
      shape?: {
        padding?: number;
        strokeWidth?: number;
        strokeColor?: React.CSSProperties["color"];
      };
      fontSize: number;
    };
    sidePanel?: {
      colors?: {
        icon?: string;
        iconActive?: string;
        text?: string;
        textActive?: string;
        hint?: string;
        hover?: string;
      };
    };
    dashboard?: {
      colors?: {
        active?: string;
        activeIcon?: string;
      };
    };
    button?: {
      primary?: string;
      secondary?: string;
    };
  }
}

const createCustomMuiTheme = (options) => {
  return createTheme({
    ...options,
  });
};

export default createCustomMuiTheme;
