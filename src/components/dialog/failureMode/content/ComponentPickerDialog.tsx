import * as React from "react";

import {Button, IconButton, TextField} from "@material-ui/core";
import useStyles from "./FailureModePickerDialog.styles";
import {Autocomplete} from "@material-ui/lab";
import {useComponents} from "@hooks/useComponents";
import {useState} from "react";
import AddIcon from "@material-ui/icons/Add";
import {Component} from "@models/componentModel";

const ComponentPickerDialog = ({setSelectedComponent}) => {
    const classes = useStyles()

    const [components, addComponent] = useComponents()
    const [name, setName] = useState<string>('');

    const _handleCreateComponent = () => {
        // TODO validation
        addComponent({name: name})
        setName('')
    }

    return (
        <div className={classes.divForm}>
            <Autocomplete
                options={components}
                getOptionLabel={(option) => option.name}
                onChange={(event, value: Component) => setSelectedComponent(value)}
                renderInput={(params) => <TextField {...params} label="Select Component" variant="outlined"/>}
                clearOnBlur={true}
            />

            <div className={classes.addButtonDiv}>
                <TextField autoFocus margin="dense" id="name" label="Component Name" type="text"
                           onChange={(e) => setName(e.target.value)} value={name}/>
                <IconButton className={classes.addButton} color="primary" component="span"
                            onClick={_handleCreateComponent}>
                    <AddIcon/>
                </IconButton>
            </div>
        </div>
    );
}

export default ComponentPickerDialog;