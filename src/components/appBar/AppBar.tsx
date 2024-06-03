import * as React from "react";
import { useEffect } from "react";
import useStyles from "@components/appBar/AppBar.styles";
import { AccountCircle } from "@mui/icons-material";
import {
  Menu,
  MenuItem,
  AppBar as MaterialAppBar,
  Box,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Typography,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordDialog from "@components/dialog/password/ChangePasswordDialog";
import { getLoggedUser, useInternalLoggedUser } from "@hooks/useInternalLoggedUser";
import { ROUTES } from "@utils/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import { PRIMARY_LANGUAGE, SECONDARY_LANGUAGE, SELECTED_LANGUAGE_KEY, SELECTED_SYSTEM } from "@utils/constants";
import { useAppBar } from "../../contexts/AppBarContext";
import { useLocation } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";

interface Props {
  title: string;
  topPanelHeight?: number;
  showBackButton?: boolean;
}

const AppBar = ({ title, showBackButton = false, topPanelHeight }: Props) => {
  const [loggedUser] = useInternalLoggedUser();
  const { classes } = useStyles();
  const history = useNavigate();
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const { appBarTitle, systemsList } = useAppBar();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSystem, setSelectedSystem] = useState<string>(() => sessionStorage.getItem(SELECTED_SYSTEM) || "");
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    const currentItem = sessionStorage.getItem(SELECTED_SYSTEM);
    if (selectedSystem !== currentItem) setSelectedSystem(currentItem);
  }, [location.pathname]);

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

  const handleSystemDelete = () => {
    setSelectedSystem("");
    sessionStorage.setItem(SELECTED_SYSTEM, "");
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
              {systemsList && (
                <Box className={classes.dropdownContainer}>
                  <TextField
                    select
                    InputLabelProps={{ shrink: false }}
                    className={classes.textfieldSelect}
                    value={selectedSystem || ""}
                    onChange={handleSystemChange}
                  >
                    {systemsList.map((s, i) => {
                      return (
                        <MenuItem key={`${s.name}-${i}`} value={s.name}>
                          {s.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  <Box className={classes.tooltipContainer}>
                    {selectedSystem && (
                      <Tooltip title={t("common.delete")} className={classes.tooltip} onClick={handleSystemDelete}>
                        <CancelIcon />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
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
