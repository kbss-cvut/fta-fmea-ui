import * as React from "react";
import useStyles from "./DrawerContent.styles";
import Editor from "@components/editor/Editor";
import EditorScrollTabs from "@components/editor/tabs/scroll/EditorScrollTabs";


const DrawerContent = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.drawerHeader}/>
            <EditorScrollTabs/>
        </React.Fragment>
    );
}

export default DrawerContent;