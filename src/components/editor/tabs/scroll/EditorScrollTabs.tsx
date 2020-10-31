import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import {useStyles} from "@components/editor/tabs/scroll/EditorScrollTabs.styles";
import {useOpenTabs} from "@hooks/useOpenTabs";
import {FaultEvent} from "@models/eventModel";
import TabPanel from "@components/editor/tabs/panel/TabPanel";
import Editor from "@components/editor/Editor";
import CloseableTab, {a11yProps} from "@components/editor/tabs/CloseableTab";

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