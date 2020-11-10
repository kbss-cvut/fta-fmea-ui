import * as React from "react";

import AddIcon from '@material-ui/icons/Add';
import {useState} from "react";
import {Button, List, ListItem, ListItemText} from "@material-ui/core";
import useStyles from "@components/drawer/menu/DrawerComponentMenuList.styles";
import {ComponentsProvider} from "@hooks/useComponents";
import {useFaultTrees} from "@hooks/useFaultTrees";
import {useOpenTabs} from "@hooks/useOpenTabs";
import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";

const DrawerComponentMenuList = () => {
    const classes = useStyles()

    const [createFaultTreeDialogOpen, setCreateFaultTreeDialogOpen] = useState(false)
    const [faultTrees] = useFaultTrees()
    const [_, openTab] = useOpenTabs()

    const closeDialog = () => {
        setCreateFaultTreeDialogOpen(false)
    }

    return (
        <div className={classes.menu}>
            <List>
                {
                    faultTrees.map(value => {
                        return (
                            <ListItem button key={value.iri} onClick={() => openTab(value)}>
                                <ListItemText primary={value.name}/>
                            </ListItem>)
                    })
                }
            </List>
            <Button className={classes.componentButton} variant="contained" color="primary" startIcon={<AddIcon/>}
                    onClick={() => setCreateFaultTreeDialogOpen(true)}>
                New Fault Tree
            </Button>

            <ComponentsProvider>
                <FaultTreeDialog open={createFaultTreeDialogOpen} handleCloseDialog={closeDialog}/>
            </ComponentsProvider>
        </div>
    );
}

export default DrawerComponentMenuList;