import * as React from "react";
import useStyles from "./DrawerContent.styles";
import Editor from "@components/editor/Editor";


const DrawerContent = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.drawerHeader}/>
            <Editor/>
        </React.Fragment>
    );
}

export default DrawerContent;