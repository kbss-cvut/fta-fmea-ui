import * as React from "react";
import useStyles from "@components/drawer/content/DrawerContent.styles";
import EditorScrollTabs from "@components/editor/faultTree/tabs/scroll/EditorScrollTabs";


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