import * as React from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from '@material-ui/icons/Save';
import {useEffect, useRef, useState} from "react";
import {ListItem, ListItemSecondaryAction, ListItemText, makeStyles} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles(theme => ({
    disabledInput: {
        color: theme.palette.text.primary,
    },
}));

interface Props {
    value: string,
    onClick: (any) => void,
}

const FaultTreeListItem = ({value, onClick}: Props) => {
    const classes = useStyles();

    const originalValue = value;

    const textFieldRef = useRef()

    const [editMode, setEditMode] = useState(false);
    const [fieldDirty, setFieldDirty] = useState(false);
    const [textFieldValue, setTextFieldValue] = useState(value);

    const handleChange = (e) => {
        setFieldDirty(true);
        setTextFieldValue(e.target.value);
    };

    const handleClick = () => {
        if (!editMode) {
            setEditMode(true);
        } else {
            setEditMode(false);
            // TODO propagate updates -> submit!
        }
    };

    const handleBlur = (e) => {
        e.preventDefault();
        if (textFieldValue === originalValue) {
            setFieldDirty(false);
            setEditMode(false);
        }
    }

    useEffect(() => {
        if (editMode) {
            // @ts-ignore
            textFieldRef.current.focus();
        }
    }, [editMode])

    let icon;
    if (!editMode) {
        icon = <IconButton edge="end" aria-label="edit" onClick={handleClick}>
            <EditIcon/>
        </IconButton>
    } else if (editMode && fieldDirty) {
        icon = <IconButton edge="end" aria-label="edit" onClick={handleClick}>
            <SaveIcon/>
        </IconButton>
    }

    return (
        <ListItem button onClick={onClick}>
            <ListItemText>
                <TextField defaultValue={textFieldValue}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           disabled={!editMode}
                           InputProps={{
                               disableUnderline: true,
                               classes: {disabled: classes.disabledInput}
                           }}
                           inputRef={textFieldRef}
                />
            </ListItemText>
            <ListItemSecondaryAction>
                {icon}
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default FaultTreeListItem;
