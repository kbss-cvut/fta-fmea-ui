import * as React from "react";

import {Box, IconButton, TextField} from "@material-ui/core";
import useStyles from "./FailureModeDialogComponent.styles";
import {useFunctions} from "@hooks/useFunctions";
import {Autocomplete} from "@material-ui/lab";
import {Function} from "@models/functionModel";
import AddIcon from "@material-ui/icons/Add";
import {Controller, useForm} from "react-hook-form";
import {schema} from "@components/dialog/failureMode/content/FunctionPickerDialog.schema";

const FunctionPickerDialog = ({setSelectedFunction, componentSelected}) => {
    const classes = useStyles()

    const [functions, addFunction] = useFunctions()
    const {register, handleSubmit, errors, reset, control} = useForm({
        resolver: schema
    });

    const _handleCreateFunction = (values: any) => {
        addFunction({name: values.name})
        // TODO clear name - setName('')
        reset(values)
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
                <Controller as={TextField} disabled={!componentSelected} autoFocus margin="dense" id="name" label="Function Name"
                            type="text" fullWidth name="name" control={control} defaultValue=""
                            inputRef={register} error={!!errors.name} helperText={errors.name?.message}/>
                <IconButton className={classes.addButton} color="primary" component="span"
                            onClick={handleSubmit(_handleCreateFunction)}>
                    <AddIcon/>
                </IconButton>
            </Box>
        </div>
    );
}

export default FunctionPickerDialog;