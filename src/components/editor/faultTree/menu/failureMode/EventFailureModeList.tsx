import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
                                <IconButton edge="end" aria-label="delete" onClick={deleteFailureMode} size="large">
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
