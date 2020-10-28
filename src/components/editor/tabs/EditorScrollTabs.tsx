import * as React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {useStyles} from "@components/editor/tabs/EditorScrollTabs.styles";
import {IconButton} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {useOpenTabs} from "@hooks/useOpenTabs";
import {FaultEvent} from "@models/eventModel";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

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
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const [openTabs] = useOpenTabs();

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
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
                    {/*<Tab label="Item One" {...a11yProps(0)} />*/}
                    {/*<Tab label="Item Two" {...a11yProps(1)} />*/}
                </Tabs>
            </AppBar>
            {
                openTabs.map((failureMode, index) =>{
                    let name = (failureMode.manifestingNode.event as FaultEvent).name
                    return <TabPanel value={value} index={index}>{name}</TabPanel>
                })
            }

            {/*<TabPanel value={value} index={0}>Item One</TabPanel>*/}
            {/*<TabPanel value={value} index={1}>Item Two</TabPanel>*/}
        </div>
    );
}

export default EditorScrollTabs;