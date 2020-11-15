import * as React from "react";

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {useState} from "react";
import {Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField} from "@material-ui/core";
import useStyles from "@components/drawer/menu/DrawerComponentMenuList.styles";
import {ComponentsProvider} from "@hooks/useComponents";
import {useFaultTrees} from "@hooks/useFaultTrees";
import {useOpenTabs} from "@hooks/useOpenTabs";
import FaultTreeDialog from "@components/dialog/faultTree/FaultTreeDialog";
import FaultTreeListItem from "@components/materialui/FaultTreeListItem";

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
                    faultTrees.map(value =>
                        <FaultTreeListItem key={value.iri} value={value.name} onClick={() => openTab(value)}/>
                    )
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