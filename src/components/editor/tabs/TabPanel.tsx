import * as React from "react";
import {useStyles} from "@components/editor/tabs/TabPanel.styles";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const {children, value, index, ...other} = props;
    const classes = useStyles()

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className={classes.tabPanelDiv}>{children}</div>
            )}
        </div>
    );
}

export default TabPanel;