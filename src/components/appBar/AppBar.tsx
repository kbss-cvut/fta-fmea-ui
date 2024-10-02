import * as React from "react";
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
import { getLoggedUser, useLoggedUser } from "@hooks/useLoggedUser";
import { ROUTES } from "@utils/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import { PRIMARY_LANGUAGE, SECONDARY_LANGUAGE, SELECTED_LANGUAGE_KEY } from "@utils/constants";
import { useAppBar } from "../../contexts/AppBarContext";
import { useLocation } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import { isUsingOidcAuth } from "@utils/OidcUtils";
import { findByIri } from "@utils/utils";
import { useSystems } from "@hooks/useSystems";

interface Props {
  title: string;
  topPanelHeight?: number;
  showBackButton?: boolean;
}

const shouldSystemSwitchBeDisabled = (url: string) => {
  const pathParts = url.split("/");
  const routes = [ROUTES.FTA.substring(1), ROUTES.SYSTEMS.substring(1)];

  return routes.some((route) => {
    const index = pathParts.indexOf(route);
    return index !== -1 && pathParts[index + 1] !== undefined;
  });
};

const AppBar = ({ title, showBackButton = false, topPanelHeight }: Props) => {
  const [loggedUser] = useLoggedUser();
  const { classes } = useStyles();
  const history = useNavigate();
  const { i18n, t } = useTranslation();
  const [systems] = useSystems();
  const { appBarTitle, isModified, setShowUnsavedChangesDialog } = useAppBar();
  const location = useLocation();
  const isGlobalSystemSwitchDisabled = shouldSystemSwitchBeDisabled(location.pathname);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSystem, setSelectedSystem] = useSelectedSystemSummaries();
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

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
    if (isModified) {
      setShowUnsavedChangesDialog(true);
    } else {
      history(-1);
    }
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
      {!isUsingOidcAuth() && <MenuItem onClick={handleChangePasswordDialogOpen}>{t("user.changePassword")}</MenuItem>}

      <MenuItem onClick={handleLogout}>{t("user.logout")}</MenuItem>
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
    const selectedSystem = findByIri(value, systems);
    setSelectedSystem(selectedSystem);
  };

  const handleSystemDelete = () => {
    setSelectedSystem(null);
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
                <Box className={classes.dropdownContainer}>
                  <TextField
                    select
                    InputLabelProps={{ shrink: false }}
                    className={classes.textfieldSelect}
                    value={
                      selectedSystem?.iri && systems.some((s) => s.iri === selectedSystem.iri) ? selectedSystem.iri : ""
                    }
                    onChange={handleSystemChange}
                    disabled={isGlobalSystemSwitchDisabled}
                  >
                    {systems.map((s, i) => {
                      return (
                        <MenuItem key={`${s.iri}`} value={s.iri}>
                          {s.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  <Box className={classes.tooltipContainer}>
                    {selectedSystem && !isGlobalSystemSwitchDisabled && (
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
