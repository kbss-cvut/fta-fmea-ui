import * as React from "react";

import {IconButton, TextField, Typography} from "@mui/material";
import {useComponents} from "@hooks/useComponents";
import AddIcon from "@mui/icons-material/Add";
import {Component} from "@models/componentModel";
import {Controller, useForm} from "react-hook-form";
import {schema} from "./Component.schema";
import useStyles from "./ComponentPicker.styles";
import {yupResolver} from "@hookform/resolvers/yup";
import ControlledAutocomplete from "@components/materialui/ControlledAutocomplete";

interface Props {
    selectedComponent: Component | null,
    onComponentSelected: (Component) => void,
}

const ComponentPicker = ({selectedComponent, onComponentSelected}: Props) => {
    const classes = useStyles()

    const [components, addComponent] = useComponents()
    const {register, handleSubmit, formState: { errors }, reset, control} = useForm({
        resolver: yupResolver(schema)
    });

    const _handleCreateComponent = (values: any) => {
        addComponent({name: values.name})
        reset(values)
    }

    console.log(components);

    // TODO ControlledAutocomplete
    return (
        <React.Fragment>
            <ControlledAutocomplete
                control={control}
                name={"component"}
                fullWidth
                options={components}
                getOptionLabel={(option) => option.name}
                onChangeCallback={(value: Component) => onComponentSelected(value)}
                renderInput={(params) => <TextField {...params} label="Select Component" variant="outlined"/>}
                clearOnBlur={true}
                defaultValue={selectedComponent}
                useSafeOptions={true}
            />

            <Typography variant="subtitle1">Create new Component</Typography>
            <div className={classes.creationBox}>
                <TextField
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Component name"
                    name="name"
                    autoFocus
                    margin={"dense"}
                />
                <IconButton
                    className={classes.addButton}
                    color="primary"
                    component="span"
                    onClick={handleSubmit(_handleCreateComponent)}
                    size="large">
                    <AddIcon/>
                </IconButton>
            </div>
        </React.Fragment>
    );
}

export default ComponentPicker;