import * as React from "react";
import clsx from 'clsx';
import {useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DrawerContent from "./DrawerContent";
import {useState} from "react";
import useStyles from "@components/drawer/PersistentDrawer.styles";
import EditorAppBar from "@components/editor/EditorAppBar";
import {withRouter} from "react-router-dom";
import DrawerComponentMenuList from "@components/drawer/DrawerComponentMenuList";
import {Typography} from "@material-ui/core";

const PersistentDrawer = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <EditorAppBar handleDrawerOpen={handleDrawerOpen} drawerOpen={open}/>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{paper: classes.drawerPaper,}}
            >
                <div className={classes.drawerHeader}>
                    <Typography className={classes.drawerHeaderTitle} variant="h6" gutterBottom>
                        Components
                    </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <DrawerComponentMenuList/>
            </Drawer>
            <main className={clsx(classes.content, {[classes.contentShift]: open,})}>
                <DrawerContent/>
            </main>
        </div>
    );
}


export default withRouter(PersistentDrawer);