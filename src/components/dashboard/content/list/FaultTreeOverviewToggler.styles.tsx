import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const iconContainer = {
  height: 32,
  width: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: 2,
  marginLeft: 4,
};

const useStyles = makeStyles()((theme: Theme) => ({
  iconContainer,
  iconContainerSelected: {
    ...iconContainer,
    backgroundColor: theme.dashboard.colors.active,
    color: theme.dashboard.colors.activeIcon,
  },
  togglerContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row-reverse",
    marginTop: 24,
  },
}));
export default useStyles;
