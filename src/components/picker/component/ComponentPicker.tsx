import * as React from "react";

import {IconButton, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {useComponents} from "@hooks/useComponents";
import AddIcon from "@material-ui/icons/Add";
import {Component} from "@models/componentModel";
import {Controller, useForm} from "react-hook-form";
import {schema} from "@components/picker/component/ComponentPicker.schema";
import useStyles from "@components/picker/component/ComponentPicker.styles";
import {yupResolver} from "@hookform/resolvers/yup";
import DividerWithText from "@components/materialui/DividerWithText";

interface Props {
    selectedComponent: Component | null,
    onComponentSelected: (Component) => void,
}

const ComponentPicker = ({selectedComponent, onComponentSelected}: Props) => {
    const classes = useStyles()

    const [components, addComponent] = useComponents()
    const {register, handleSubmit, errors, reset, control} = useForm({
        resolver: yupResolver(schema)
    });

    const _handleCreateComponent = (values: any) => {
        addComponent({name: values.name})
        reset(values)
    }

    // TODO ControlledAutocomplete
    return (
        <React.Fragment>
            <Autocomplete
                fullWidth
                options={components}
                getOptionLabel={(option) => option.name}
                onChange={(event, value: Component) => onComponentSelected(value)}
                renderInput={(params) => <TextField {...params} label="Select Component" variant="outlined"/>}
                clearOnBlur={true}
                defaultValue={selectedComponent}
            />

            <DividerWithText>Create new Component</DividerWithText>

            <div className={classes.addButtonDiv}>
                <Controller as={TextField} autoFocus margin="dense" id="name" label="Component Name"
                            type="text" fullWidth name="name" control={control} defaultValue=""
                            inputRef={register} error={!!errors.name} helperText={errors.name?.message}/>
                <IconButton className={classes.addButton} color="primary" component="span"
                            onClick={handleSubmit(_handleCreateComponent)}>
                    <AddIcon/>
                </IconButton>
            </div>
        </React.Fragment>
    );
}

export default ComponentPicker;