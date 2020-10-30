import Tab from "@material-ui/core/Tab";
import {IconButton} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import * as React from "react";

export const a11yProps = (index: any) => {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const CloseableTab = ({title, a11yProps, onTabClose}) => {
    return (
        <Tab
            component="div"
            label={<span>{title}<IconButton onClick={() => onTabClose()}><Close/></IconButton>
            </span>}
            {...a11yProps}
        />)
}

export default CloseableTab;