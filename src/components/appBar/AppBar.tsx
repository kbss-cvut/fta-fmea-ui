import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import * as React from "react";
import useStyles from "@components/appBar/AppBar.styles";
import { AccountCircle } from "@mui/icons-material";
import { Menu, MenuItem, AppBar as MaterialAppBar, Box, FormControl, InputLabel, TextField } from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordDialog from "@components/dialog/password/ChangePasswordDialog";
import { getLoggedUser, useLoggedUser } from "@hooks/useLoggedUser";
import { ROUTES } from "@utils/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import { PRIMARY_LANGUAGE, SECONDARY_LANGUAGE, SELECTED_LANGUAGE_KEY, SELECTED_SYSTEM } from "@utils/constants";
import { useAppBarTitle } from "../../contexts/AppBarTitleContext";
import * as systemService from "@services/systemService";
import { System } from "@models/systemModel";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { axiosSource } from "@services/utils/axiosUtils";

interface Props {
  title: string;
  topPanelHeight?: number;
  showBackButton?: boolean;
}

const AppBar = ({ title, showBackButton = false, topPanelHeight }: Props) => {
  const [loggedUser] = useLoggedUser();
  const { classes } = useStyles();
  const history = useNavigate();
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { appBarTitle } = useAppBarTitle();
  const [showSnackbar] = useSnackbar();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSystem, setSelectedSystem] = useState<string>(() => sessionStorage.getItem(SELECTED_SYSTEM) || "");
  const [systems, setSystems] = useState<System[]>([]);

  const isMenuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    const fetchSystems = async () => {
      systemService
        .findAll()
        .then((value) => setSystems(value))
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };

    fetchSystems();

    return () => axiosSource.cancel("SystemsProvider - unmounting");
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePasswordDialogOpen = () => {
    handleMenuClose();
    setChangePasswordDialogOpen(true);
  };

  const handleLogout = (e: FormEvent) => {
    e.preventDefault();
    history(ROUTES.LOGOUT);
  };

  const navigateToAdmin = (e: FormEvent) => {
    e.preventDefault();
    history(ROUTES.ADMINISTRATION);
  };

  const goBack = () => {
    history(-1);
  };

  const menuId = "user-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {loggedUser.roles && loggedUser.roles.indexOf("ROLE_ADMIN") >= 0 && (
        <MenuItem onClick={navigateToAdmin}>Administration</MenuItem>
      )}
      <MenuItem onClick={handleChangePasswordDialogOpen}>Change Password</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  const toggleLanguage = () => {
    if (i18n.resolvedLanguage === PRIMARY_LANGUAGE) {
      i18n.changeLanguage(SECONDARY_LANGUAGE);
      localStorage.setItem(SELECTED_LANGUAGE_KEY, SECONDARY_LANGUAGE);
    } else {
      i18n.changeLanguage(PRIMARY_LANGUAGE);
      localStorage.setItem(SELECTED_LANGUAGE_KEY, PRIMARY_LANGUAGE);
    }
  };

  const handleSystemChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSelectedSystem(value);
    sessionStorage.setItem(SELECTED_SYSTEM, value);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div>
      <MaterialAppBar position="fixed" elevation={0}>
        <Toolbar>
          {showBackButton && (
            <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={goBack} size="large">
              <ArrowBackIcon />
            </IconButton>
          )}

          <Typography className={classes.title} variant="h6" noWrap>
            {appBarTitle}
          </Typography>

          <Box className={classes.textfieldContainer}>
            <FormControl fullWidth>
              {!selectedSystem && (
                <InputLabel className={classes.inputLabel}>{t("appBar.selectSystemPlaceholder")}</InputLabel>
              )}
              {systems && (
                <TextField
                  select
                  InputLabelProps={{ shrink: false }}
                  className={classes.textfieldSelect}
                  value={selectedSystem}
                  onChange={handleSystemChange}
                >
                  {systems.map((s, i) => {
                    return (
                      <MenuItem key={`${s.name}-${i}`} value={s.name}>
                        {s.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              )}
            </FormControl>
          </Box>

          <div className={classes.languageToggler} onClick={toggleLanguage}>
            <LanguageIcon className={classes.languageIcon} />
            <p className={classes.languageLabel}>{i18n.resolvedLanguage === "en" ? "EN" : "CZ"}</p>
          </div>

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            size="large"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </MaterialAppBar>
      {renderMenu}

      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        handleCloseDialog={() => setChangePasswordDialogOpen(false)}
        user={getLoggedUser()}
      />
    </div>
  );
};

export default AppBar;
