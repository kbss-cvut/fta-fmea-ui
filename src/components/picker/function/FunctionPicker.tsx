import * as React from "react";

import {Box, IconButton, TextField} from "@material-ui/core";
import {useFunctions} from "@hooks/useFunctions";
import {Autocomplete} from "@material-ui/lab";
import {Function} from "@models/functionModel";
import AddIcon from "@material-ui/icons/Add";
import {Controller, useForm} from "react-hook-form";
import {schema} from "@components/picker/function/FunctionPicker.schema";
import useStyles from "@components/picker/function/FunctionPicker.styles";
import { yupResolver } from "@hookform/resolvers/yup";

const FunctionPicker = ({setSelectedFunction}) => {
    const classes = useStyles()

    const [functions, addFunction] = useFunctions()
    const {register, handleSubmit, errors, reset, control} = useForm({
        resolver: yupResolver(schema)
    });

    const _handleCreateFunction = (values: any) => {
        addFunction({name: values.name})
        reset(values)
    }

    return (
        <React.Fragment>
            <Autocomplete
                options={functions}
                getOptionLabel={(option) => option.name}
                onChange={(event, value: Function) => setSelectedFunction(value)}
                renderInput={(params) => <TextField {...params} label="Select Function" variant="outlined"/>}
                clearOnBlur={true}
            />

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