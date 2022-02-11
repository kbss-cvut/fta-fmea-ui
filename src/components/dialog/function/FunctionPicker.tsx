import * as React from "react";
import {useState} from "react";

import {Box, IconButton, TextField, Typography} from "@material-ui/core";
import {useFunctions} from "@hooks/useFunctions";
import {Autocomplete} from "@material-ui/lab";
import {Function} from "@models/functionModel";
import AddIcon from "@material-ui/icons/Add";
import {Controller, useForm} from "react-hook-form";
import {schema} from "./FunctionPicker.schema";
import useStyles from "./FunctionPicker.styles";
import {yupResolver} from "@hookform/resolvers/yup";
import {BehaviorType} from "@models/failureModeModel";

interface Props {
    selectedFunctions: Function[] | null,
    onFunctionsSelected: (functions: Function[]) => void,
}

const FunctionPicker = ({selectedFunctions, onFunctionsSelected}: Props) => {
    const classes = useStyles()

    const [functions, addFunction] = useFunctions()
    const {register, handleSubmit, errors, reset, control} = useForm({
        resolver: yupResolver(schema)
    });

    const _handleCreateFunction = (values: any) => {
        addFunction({behaviorType: BehaviorType.ATOMIC, childBehaviors: [], failureModes: [], requiredFunctions: [], name: values.name})
        reset(values)
    }

    const [_selectedFunctions, _setSelectedFunctions] = useState<Function[]>([])

    const handleChange = (values: Function[]) => {
        _setSelectedFunctions(values)
        onFunctionsSelected(values)
    }

    // TODO ControlledAutocomplete
    return (
        <React.Fragment>
            <Autocomplete
                className={classes.autocomplete}
                multiple
                options={functions}
                getOptionLabel={(option) => option.name}
                clearOnBlur={true}
                defaultValue={selectedFunctions}
                onChange={(event, values: Function[]) => handleChange(values)}
                renderInput={(params) => (
                    <TextField {...params} label="Select Functions" variant="standard"/>
                )}
            />

            <Typography variant="subtitle1">Create new Function</Typography>
            <Box className={classes.addButtonDiv}>
                <Controller as={TextField} autoFocus margin="dense" id="name" label="Function Name"
                            type="text" fullWidth name="name" control={control} defaultValue=""
                            inputRef={register} error={!!errors.name} helperText={errors.name?.message}/>
                <IconButton className={classes.addButton} color="primary" component="span"
                            onClick={handleSubmit(_handleCreateFunction)}>
                    <AddIcon/>
                </IconButton>
            </Box>
        </React.Fragment>
    );
}

export default FunctionPicker;