import * as React from "react";

import {IconButton, TextField} from "@material-ui/core";
import useStyles from "./FailureModePickerDialog.styles";
import {Autocomplete} from "@material-ui/lab";
import {useComponents} from "@hooks/useComponents";
import AddIcon from "@material-ui/icons/Add";
import {Component} from "@models/componentModel";
import {Controller, useForm} from "react-hook-form";
import {schema} from "@components/dialog/failureMode/content/FunctionPickerDialog.schema";

const ComponentPickerDialog = ({setSelectedComponent}) => {
    const classes = useStyles()

    const [components, addComponent] = useComponents()
    const {register, handleSubmit, errors, reset, control} = useForm({
        resolver: schema
    });

    const _handleCreateComponent = (values: any) => {
        addComponent({name: values.name})
        reset(values)
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
                <Controller as={TextField} autoFocus margin="dense" id="name" label="Component Name"
                            type="text" fullWidth name="name" control={control} defaultValue=""
                            inputRef={register} error={!!errors.name} helperText={errors.name?.message}/>
                <IconButton className={classes.addButton} color="primary" component="span"
                            onClick={handleSubmit(_handleCreateComponent)}>
                    <AddIcon/>
                </IconButton>
            </div>
        </div>
    );
}

export default ComponentPickerDialog;