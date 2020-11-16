import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import useStyles from "@components/appBar/AppBar.styles";
import {AccountCircle} from "@material-ui/icons";
import {Menu, MenuItem, AppBar as MaterialAppBar} from "@material-ui/core";
import {FormEvent, useState} from "react";
import {useHistory} from "react-router-dom";
import {useDrawerOpen} from "@hooks/useDrawerOpen";
import ChangePasswordDialog from "@components/dialog/password/ChangePasswordDialog";
import {getLoggedUser} from "@hooks/useLoggedUser";

const AppBar = () => {
    const classes = useStyles();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);
    const [open, setOpen] = useDrawerOpen();

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
        history.push('/logout')
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
            <MenuItem onClick={handleChangePasswordDialogOpen}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

    return (
        <div>
            <MaterialAppBar
                position="fixed"
                className={clsx(classes.appBar, {[classes.appBarShift]: open,})}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(true)}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>Editor</Typography>
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