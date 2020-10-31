import * as React from "react";

import AddIcon from '@material-ui/icons/Add';
import {useState} from "react";
import {Button, List, ListItem, ListItemText} from "@material-ui/core";
import useStyles from "@components/drawer/menu/DrawerComponentMenuList.styles";
import FailureModeDialog from "@components/dialog/failureMode/FailureModeDialog";
import {ComponentsProvider} from "@hooks/useComponents";
import {useFailureModes} from "@hooks/useFailureModes";
import * as failureModeService from "@services/failureModeService"
import {useOpenTabs} from "@hooks/useOpenTabs";

const DrawerComponentMenuList = () => {
    const classes = useStyles()

    const [createFailureModeDialogOpen, isCreateFailureModeDialogOpen] = useState(false)
    const [failureModes] = useFailureModes()
    const [_, openTab] = useOpenTabs()

    const closeDialog = () => {
        isCreateFailureModeDialogOpen(false)
    }

    return (
        <div className={classes.menu}>
            <List>
                {
                    failureModes.map(value => {
                        let event = failureModeService.extractEvent(value)
                        return (
                            <ListItem button key={event.iri} onClick={() => openTab(value)}>
                                <ListItemText primary={event.name}/>
                            </ListItem>)
                    })
                }
            </List>
            <Button className={classes.componentButton} variant="contained" color="primary" startIcon={<AddIcon/>}
                    onClick={() => isCreateFailureModeDialogOpen(true)}>
                New Failure Mode
            </Button>

            <ComponentsProvider>
                <FailureModeDialog open={createFailureModeDialogOpen} handleCloseDialog={closeDialog}/>
            </ComponentsProvider>
        </div>
    );
}

export default DrawerComponentMenuList;