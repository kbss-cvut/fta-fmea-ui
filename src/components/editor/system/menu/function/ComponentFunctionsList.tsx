import * as React from "react";
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
} from "@material-ui/core";
import {Controller, useForm} from "react-hook-form";
import AddIcon from "@material-ui/icons/Add";
import useStyles from "@components/editor/system/menu/function/ComponentFunctionsList.styles";
import {useFunctions} from "@hooks/useFunctions";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "@components/dialog/function/FunctionPicker.schema";
import DeleteIcon from '@material-ui/icons/Delete';
import {Function} from "@models/functionModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";

const ComponentFunctionsList = () => {
    const classes = useStyles();

    const [requestConfirmation] = useConfirmDialog()

    const [functions, addFunction, removeFunction] = useFunctions();
    const {register, handleSubmit, errors, control, reset} = useForm({
        resolver: yupResolver(schema)
    });
    const _handleCreateFunction = (values: any) => {
        addFunction({name: values.name});
        reset(values)
    }

    const handleDeleteFunction = (funcToDelete: Function) => {
        requestConfirmation({
            title: 'Delete Function?',
            explanation: 'Are you sure you want to delete the function?',
            onConfirm: () => removeFunction(funcToDelete),
        })
    }

    return (
        <React.Fragment>
            <List>
                {functions.map(f => <ListItem>
                    <ListItemText primary={f.name}/>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFunction(f)}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>)}
            </List>
            <Box className={classes.functions}>
                <Controller as={TextField} autoFocus margin="dense" id="name" label="Function Name"
                            type="text" fullWidth name="name" control={control} defaultValue=""
                            inputRef={register} error={!!errors.name} helperText={errors.name?.message}/>
                <IconButton className={classes.button} color="primary" component="span"
                            onClick={handleSubmit(_handleCreateFunction)}>
                    <AddIcon/>
                </IconButton>
            </Box>
        </React.Fragment>
    );
}

export default ComponentFunctionsList;