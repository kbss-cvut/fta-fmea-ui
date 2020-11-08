import * as React from 'react';
import * as _ from "lodash";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import {useStyles} from "@components/editor/tabs/scroll/EditorScrollTabs.styles";
import {useOpenTabs} from "@hooks/useOpenTabs";
import {FaultEvent} from "@models/eventModel";
import TabPanel from "@components/editor/tabs/panel/TabPanel";
import Editor from "@components/editor/Editor";
import {IconButton} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import Tab from "@material-ui/core/Tab";
import {FailureMode} from "@models/failureModeModel";
import {useEffect, useState} from "react";
import PngExporter, {PngExportData} from "@components/editor/tools/PngExporter";
import {CurrentFailureModeProvider} from "@hooks/useCurrentFailureMode";

const a11yProps = (index: any) => {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const EditorScrollTabs = () => {
    const classes = useStyles();
    const [currentTab, setCurrentTab] = React.useState(0);

    const [tabs, , closeTab, currentTabIri] = useOpenTabs();
    const openTabs = _.orderBy(_.filter(tabs, 'open'), ['openTime'], ['asc'])

    useEffect(() => {
        const index = _.findIndex(openTabs, (o) => o.data.iri === currentTabIri);
        if (index > -1) {
            setCurrentTab(index)
        } else {
            setCurrentTab(0)
        }
    }, [currentTabIri])

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setCurrentTab(newValue)
    };


    const handleTabClose = (e, index: number, failureMode: FailureMode) => {
        e.stopPropagation()

        if(index > 0) {
            setCurrentTab(index - 1)
        } else {
            setCurrentTab(0)
        }
        closeTab(failureMode)
    }

    const [exportData, setExportData] = useState<PngExportData>();

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
                    aria-label="scrollable auto tabs"
                >
                    {
                        openTabs.map((failureModeTab, index) => {
                            const failureMode = failureModeTab.data;
                            const tabTitle = (failureMode.manifestingNode.event as FaultEvent).name
                            return <Tab
                                key={`tab-failure-mode-${failureMode.iri}`}
                                component="div"
                                label={<span>{tabTitle}<IconButton
                                    onClick={(e) => handleTabClose(e, index, failureMode)}><Close/></IconButton></span>}
                                {...a11yProps(index)}/>
                        })
                    }
                </Tabs>
            </AppBar>
            {
                openTabs.map((failureModeTab, index) => {
                    const failureMode = failureModeTab.data;
                    return (
                        <TabPanel key={`tab-panel-${failureMode.iri}`} value={currentTab} index={index}>
                            <CurrentFailureModeProvider failureModeIri={failureMode.iri}>
                                <Editor exportImage={(encodedData) => setExportData(encodedData)}/>
                            </CurrentFailureModeProvider>
                            {exportData && <PngExporter open={Boolean(exportData)} exportData={exportData}
                                                        onClose={() => setExportData(null)}/>}
                        </TabPanel>)
                })
            }
        </div>
    );
}

export default EditorScrollTabs;