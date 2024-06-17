import { createTheme } from "@mui/material";
import createCustomMuiTheme from "@styles/App.styles.declarations";

const _defaultTheme = createTheme();
export const appTheme = createCustomMuiTheme({
  appDrawer: {
    width: 240,
  },
  editor: {
    shape: {
      padding: _defaultTheme.spacing(2) as unknown as number,
      strokeWidth: 1,
      strokeColor: "black",
    },
    fontSize: 15,
  },
  sidePanel: {
    colors: {
      icon: "#757575",
      iconActive: "#3386D7",
      text: "#212121",
      textActive: "#1976D2DE",
      hint: "#00000099",
      hover: "#1976d21f",
    },
  },
  dashboard: {
    colors: {
      active: "#3386D7",
      activeIcon: "#FFFFFF",
    },
  },
  button: {
    primary: "#1774d1",
    secondary: "#FFFFFF",
  },
  main: {
    black: "#000000",
    grey: "#808080",
  },
});
