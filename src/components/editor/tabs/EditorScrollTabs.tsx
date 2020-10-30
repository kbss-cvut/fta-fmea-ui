import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {useStyles} from "@components/editor/tabs/EditorScrollTabs.styles";
import {useOpenTabs} from "@hooks/useOpenTabs";
import {IconButton} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {FaultEvent} from "@models/eventModel";
import TabPanel from "@components/editor/tabs/TabPanel";
import Editor from "@components/editor/Editor";


const CloseableTab = ({title, a11yProps, onTabClose}) => {
    return (
        <Tab
            component="div"
            label={<span>{title}<IconButton onClick={() => onTabClose()}><Close/></IconButton></span>}
            {...a11yProps}
        />)
}

const a11yProps = (index: any) => {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const EditorScrollTabs = () => {
    const classes = useStyles();
    const [currentTab, setCurrentTab] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setCurrentTab(newValue);
    };

    const [openTabs, _, closeTab] = useOpenTabs();

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={currentTab}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {
                        openTabs.map((failureMode, index) => {
                            const tabTitle = (failureMode.manifestingNode.event as FaultEvent).name
                            return <CloseableTab title={tabTitle} a11yProps={a11yProps(index)}
                                                 onTabClose={() => closeTab(failureMode)}/>
                        })
                    }
                </Tabs>
            </AppBar>
            {
                openTabs.map((failureMode, index) => {
                    return <TabPanel value={currentTab} index={index}><Editor failureMode={failureMode}/></TabPanel>
                })
            }
        </div>
    );
}

export default EditorScrollTabs;