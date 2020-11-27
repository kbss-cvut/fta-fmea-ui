import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import * as React from "react";
import {useEventFailureMode} from "@hooks/useEventFailureMode";

interface Props {
    onFailureModeClick: (FailureMode) => void,
}

const EventFailureModeList = ({onFailureModeClick}: Props) => {
    const [failureMode, deleteFailureMode] = useEventFailureMode();

    return (
        <React.Fragment>
            {
                failureMode ?
                    <List>
                        <ListItem button>
                            <ListItemText primary={failureMode?.name} onClick={() => onFailureModeClick(failureMode)}/>
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={deleteFailureMode}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                    :
                    <Typography/>
            }
        </React.Fragment>
    );
}

export default EventFailureModeList;
