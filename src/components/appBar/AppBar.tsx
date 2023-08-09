import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import * as React from "react";
import useStyles from "@components/appBar/AppBar.styles";
import {AccountCircle} from "@mui/icons-material";
import {Menu, MenuItem, AppBar as MaterialAppBar} from "@mui/material";
import {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import ChangePasswordDialog from "@components/dialog/password/ChangePasswordDialog";
import {getLoggedUser, useLoggedUser} from "@hooks/useLoggedUser";
import {ROUTES} from "@utils/constants";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
    title: string,
    showBackButton?: boolean,
}

const AppBar = ({title, showBackButton = false}: Props) => {
    const [loggedUser] = useLoggedUser();
    const classes = useStyles();
    const history = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
    }

    const handleLogout = (e: FormEvent) => {
        e.preventDefault();
        history(ROUTES.LOGOUT)
    }

    const navigateToAdmin = (e: FormEvent) => {
        e.preventDefault();
        history(ROUTES.ADMINISTRATION)
    }

    const goBack = () => {
        if (history.length > 2) history(-1);
        else history(ROUTES.DASHBOARD);
    }

    const menuId = 'user-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={menuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >

            {loggedUser.roles && loggedUser.roles.indexOf("ROLE_ADMIN") >= 0 &&
            <MenuItem onClick={navigateToAdmin}>Administration</MenuItem>
            }
            <MenuItem onClick={handleChangePasswordDialogOpen}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

    return (
        <div>
            <MaterialAppBar
                position="fixed">
                <Toolbar>
                    {showBackButton &&
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        onClick={goBack}
                        size="large">
                        <ArrowBackIcon/>
                    </IconButton>
                    }

                    <Typography className={classes.title} variant="h6" noWrap>{title}</Typography>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        size="large">
                        <AccountCircle/>
                    </IconButton>
                </Toolbar>
            </MaterialAppBar>
            {renderMenu}

            <ChangePasswordDialog open={changePasswordDialogOpen}
                                  handleCloseDialog={() => setChangePasswordDialogOpen(false)}
                                  user={getLoggedUser()}/>
        </div>
    );
}

export default AppBar;