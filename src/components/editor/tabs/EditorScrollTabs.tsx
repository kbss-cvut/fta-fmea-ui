import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {useStyles} from "@components/editor/tabs/EditorScrollTabs.styles";
import {useOpenTabs} from "@hooks/useOpenTabs";
import {FaultEvent} from "@models/eventModel";
import TabPanel from "@components/editor/tabs/TabPanel";
import Editor from "@components/editor/Editor";



// const CloseableTab = (title) => {
//     return (
//         <Tab component="div" label={
//             <span>
//     {title}
//     <IconButton onClick={() => {
//     }}>
//       <Close/>
//     </IconButton>
//   </span>
//         }/>
//     )
// }

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

    const [openTabs] = useOpenTabs();

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
                        openTabs.map((failureMode, index) =>
                            <Tab label={(failureMode.manifestingNode.event as FaultEvent).name} {...a11yProps(index)} />
                        )
                    }
                </Tabs>
            </AppBar>
            {
                openTabs.map((failureMode, index) =>{
                    let name = (failureMode.manifestingNode.event as FaultEvent).name
                    return <TabPanel value={currentTab} index={index}><Editor failureMode={failureMode}/></TabPanel>
                })
            }
        </div>
    );
}

export default EditorScrollTabs;