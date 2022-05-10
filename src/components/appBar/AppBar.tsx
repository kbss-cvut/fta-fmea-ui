import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import useStyles from "@components/appBar/AppBar.styles";
import {AccountCircle} from "@material-ui/icons";
import {Menu, MenuItem, AppBar as MaterialAppBar} from "@material-ui/core";
import {FormEvent, useState} from "react";
import {useHistory} from "react-router-dom";
import ChangePasswordDialog from "@components/dialog/password/ChangePasswordDialog";
import {getLoggedUser, useLoggedUser} from "@hooks/useLoggedUser";
import {ROUTES} from "@utils/constants";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

interface Props {
    title: string,
    showBackButton?: boolean,
}

const AppBar = ({title, showBackButton = false}: Props) => {
    const [loggedUser] = useLoggedUser();
    const classes = useStyles();
    const history = useHistory();

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
        history.push(ROUTES.LOGOUT)
    }

    const navigateToAdmin = (e: FormEvent) => {
        e.preventDefault();
        history.push(ROUTES.ADMINISTRATION)
    }

    const goBack = () => {
        if (history.length > 2) history.goBack();
        else history.push(ROUTES.DASHBOARD);
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
                    <IconButton edge="start" className={classes.menuButton} color="inherit"
                                onClick={goBack}>
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
                    >
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