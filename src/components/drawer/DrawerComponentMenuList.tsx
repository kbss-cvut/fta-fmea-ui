import * as React from "react";

import AddIcon from '@material-ui/icons/Add';
import {useState} from "react";
import {Button, List, ListItem, ListItemText} from "@material-ui/core";
import useStyles from "@components/drawer/DrawerComponentMenuList.styles";
import FailureModeDialog from "@components/dialog/failureMode/FailureModeDialog";
import {useFailureModeEvents} from "@hooks/useFailureModeEvents";
import {FaultEvent} from "@models/eventModel";
import {FailureModesProvider} from "@hooks/useFailureModes";
import {ComponentsProvider} from "@hooks/useComponents";

const DrawerComponentMenuList = () => {
    const classes = useStyles();

    const [createFailureModeDialogOpen, isCreateFailureModeDialogOpen] = useState(false);
    const failureModesEvents = useFailureModeEvents();

    const closeDialog = () => {
        isCreateFailureModeDialogOpen(false)
    }

    return (
        <div className={classes.menu}>
            <List>
                {
                    failureModesEvents.map((value: FaultEvent) => (
                        <ListItem button key={value.iri}>
                            <ListItemText primary={value.name}/>
                        </ListItem>
                    ))
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