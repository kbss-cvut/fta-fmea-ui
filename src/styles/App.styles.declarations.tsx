import * as React from "react";
import { createTheme } from "@mui/material/styles";

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
  }
}

const createCustomMuiTheme = (options) => {
  return createTheme({
    ...options,
  });
};

export default createCustomMuiTheme;
