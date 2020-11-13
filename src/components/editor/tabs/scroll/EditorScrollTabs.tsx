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
import {useEffect, useState} from "react";
import PngExporter, {PngExportData} from "@components/editor/tools/PngExporter";
import {CurrentFaultTreeProvider} from "@hooks/useCurrentFaultTree";
import {FaultTree} from "@models/faultTreeModel";

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


    const handleTabClose = (e, index: number, failureMode: FaultTree) => {
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
                        openTabs.map((faultTreeTab, index) => {
                            const faultTree = faultTreeTab.data;
                            return <Tab
                                key={`tab-failure-mode-${faultTree.iri}`}
                                component="div"
                                label={<span>{faultTree.name}<IconButton
                                    onClick={(e) => handleTabClose(e, index, faultTree)}><Close/></IconButton></span>}
                                {...a11yProps(index)}/>
                        })
                    }
                </Tabs>
            </AppBar>
            {
                openTabs.map((faultTreeTab, index) => {
                    const faultTree = faultTreeTab.data;
                    return (
                        <TabPanel key={`tab-panel-${faultTree.iri}`} value={currentTab} index={index}>
                            <CurrentFaultTreeProvider faultTreeIri={faultTree.iri}>
                                <Editor exportImage={(encodedData) => setExportData(encodedData)}/>
                            </CurrentFaultTreeProvider>
                            {exportData && <PngExporter open={Boolean(exportData)} exportData={exportData}
                                                        onClose={() => setExportData(null)}/>}
                        </TabPanel>)
                })
            }
        </div>
    );
}

export default EditorScrollTabs;