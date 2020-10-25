import * as React from "react";

import {Box, Button, IconButton, TextField} from "@material-ui/core";
import useStyles from "./FailureModePickerDialog.styles";
import {useFunctions} from "@hooks/useFunctions";
import {Autocomplete} from "@material-ui/lab";
import {Function} from "@models/functionModel";
import AddIcon from "@material-ui/icons/Add";
import {useState} from "react";

const FunctionPickerDialog = ({setSelectedFunction, componentSelected}) => {
    const classes = useStyles()

    const [name, setName] = useState<string>('');
    const [functions, addFunction] = useFunctions()

    console.log(`FunctionPickerDialog - functions: ${functions}`)

    const _handleCreateFunction = () => {
        // TODO validation
        addFunction({name: name})
        setName('')
    }

    return (
        <div className={classes.divForm}>
            <Autocomplete
                disabled={!componentSelected}
                options={functions}
                getOptionLabel={(option) => option.name}
                onChange={(event, value: Function) => setSelectedFunction(value)}
                renderInput={(params) => <TextField {...params} label="Select Function" variant="outlined"/>}
                clearOnBlur={true}
            />

            <Box className={classes.addButtonDiv}>
                <TextField disabled={!componentSelected} autoFocus margin="dense" id="name" label="Function Name"
                           type="text" fullWidth
                           onChange={(e) => setName(e.target.value)} value={name}/>
                <IconButton className={classes.addButton} color="primary" component="span"
                            onClick={_handleCreateFunction}>
                    <AddIcon/>
                </IconButton>
            </Box>
        </div>
    );
}

export default FunctionPickerDialog;