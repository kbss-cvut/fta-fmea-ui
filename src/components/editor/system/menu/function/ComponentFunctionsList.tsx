import * as React from "react";
import {
    Box, Checkbox, FormControl,
    IconButton, InputLabel,
    List, ListItem,
    ListItemSecondaryAction,
    ListItemText, MenuItem, Select,
    TextField, FormGroup, Grid, Tooltip
} from "@material-ui/core";
import {useForm, Controller} from "react-hook-form";
import AddIcon from "@material-ui/icons/Add";
import useStyles from "@components/editor/system/menu/function/ComponentFunctionsList.styles";
import {useFunctions} from "@hooks/useFunctions";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "@components/dialog/function/FunctionPicker.schema";
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close'
import {CreateFunction, Function} from "@models/functionModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import {useState} from "react";
import {Edit} from "@material-ui/icons";
import DeviceHubIcon from '@material-ui/icons/DeviceHub';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

const ComponentFunctionsList = () => {
    const classes = useStyles();
    const [requestConfirmation] = useConfirmDialog()
    const [functions, addFunction, editFunction, removeFunction, addRequiredFunction, allFunctions, functionsAndComponents] = useFunctions()
    const [requiredFunctions, setRequiredFunctions] = useState<Function[]>([]);
    const [selectedFunction, setSelectedFunction] = useState<Function>()
    const [showEdit, setShowEdit] = useState<boolean>(false)

    const {register, handleSubmit, errors, control, reset} = useForm({
        resolver: yupResolver(schema)
    });
    const _handleCreateFunction = (values: any) => {
        let createFunction: CreateFunction = {name: values.name}
        addFunction(createFunction).then(f => {
            requiredFunctions.forEach(selectedF => {
                addRequiredFunction(f.iri, selectedF.iri)
            })
        })
        reset(values)
        setRequiredFunctions([])
    }

    const showEditForm = (funcToEdit: Function) => {
        setSelectedFunction(funcToEdit)

        if (!Array.isArray(funcToEdit.requiredFunctions)) {
            funcToEdit.requiredFunctions = [funcToEdit.requiredFunctions]
        }
        funcToEdit.requiredFunctions.forEach(func => {
            requiredFunctions.push(allFunctions.find(f => f.iri == func.iri))
        })
        setShowEdit(true)
    }

    const hideEditForm = () => {
        setRequiredFunctions([])
        setShowEdit(false)
    }

    const handleEditFunction = (funcToEdit: Function) => {
        selectedFunction.name = funcToEdit.name
        selectedFunction.requiredFunctions = requiredFunctions
        editFunction(selectedFunction)
        setRequiredFunctions([])
        setShowEdit(false)
    }

    const handleDeleteFunction = (funcToDelete: Function) => {
        requestConfirmation({
            title: 'Delete Function?',
            explanation: 'Are you sure you want to delete the function?',
            onConfirm: () => removeFunction(funcToDelete),
        })
    }

    const handleChange = (event) => {
        setRequiredFunctions(event.target.value)
    }

    const formatFunctionOutput = (func, comp) => {
        let result = func.name + (comp != null ? " (" + comp.name + " )" : "")
        return result.length > 50 ? result.substring(0, 50).concat("...") : result
    }

    const formatOutput = (name, limit) => {
        return name.length > limit ? name.substring(0, limit).concat("...") : name
    }

    // @ts-ignore
    return (
        <React.Fragment>
            <List>
                {showEdit
                    ? <Grid>
                        <Box component="div" className={classes.editHeader}>
                            <h4>Edit function:</h4>
                            <IconButton component="div" onClick={handleSubmit(hideEditForm)}>
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                        <Box className={classes.functions}>
                            <FormGroup>
                                <FormControl>
                                    <Controller as={TextField} autoFocus margin="dense" id="name" label="Function Name"
                                                type="text" fullWidth name="name" control={control}
                                                defaultValue={selectedFunction.name}
                                                inputRef={register} error={!!errors.name}
                                                helperText={errors.name?.message}/>
                                </FormControl>
                                <FormControl>
                                    <InputLabel id="required-functions-multiselect-label">Required
                                        functions:</InputLabel>
                                    <Select
                                        labelId="required-functions-multiselect-label"
                                        id="required-functions-multiselect"
                                        multiple
                                        displayEmpty
                                        value={requiredFunctions}
                                        onChange={handleChange}
                                        renderValue={(selected: any[]) => (formatOutput(selected.map(value => value.name).join(", "), 65))}
                                        MenuProps={MenuProps}
                                    >
                                        {functionsAndComponents.map((f) =>
                                            //@ts-ignore
                                            <MenuItem key={f[0].iri} value={f[0]}>
                                                <Checkbox checked={requiredFunctions.includes(f[0])}/>
                                                <Tooltip disableFocusListener
                                                         title={f[0].name + (f[1] != null ? " (" + f[1].name + ")" : "")}>
                                                    <ListItemText primary={formatFunctionOutput(f[0], f[1])}/>
                                                </Tooltip>
                                            </MenuItem>
                                        )}
                                    </Select>
                                    <IconButton className={classes.button} color="primary" component="span"
                                                onClick={handleSubmit(handleEditFunction)}>
                                        <Edit/>
                                    </IconButton>
                                </FormControl>
                            </FormGroup>
                        </Box>
                    </Grid>
                    : <Box>
                        {functions.map(f => <ListItem>
                            <ListItemText primary={formatOutput(f.name, 35)}/>
                            <ListItemSecondaryAction>
                                <IconButton className={classes.button} onClick={() => showEditForm(f)}>
                                    <Edit/>
                                </IconButton>
                                <Tooltip disableFocusListener
                                         title={Array.isArray(f.requiredFunctions) ? f.requiredFunctions.map(func => func.name).join(", ") || "None" : f.requiredFunctions['name']}>
                                    <IconButton className={classes.button}>
                                        <DeviceHubIcon/>
                                    </IconButton>
                                </Tooltip>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFunction(f)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>)}
                        <Box className={classes.functions}>
                            <FormGroup>
                                <FormControl>
                                    <Controller as={TextField} autoFocus margin="dense" id="name" label="Function Name"
                                                type="text" fullWidth name="name" control={control} defaultValue=""
                                                inputRef={register} error={!!errors.name}
                                                helperText={errors.name?.message}/>
                                </FormControl>
                                <FormControl>
                                    <InputLabel id="required-functions-multiselect-label">Required functions:</InputLabel>
                                    <Select
                                        labelId="required-functions-multiselect-label"
                                        id="required-functions-multiselect"
                                        multiple
                                        value={requiredFunctions}
                                        onChange={handleChange}
                                        renderValue={(selected: any[]) => (formatOutput(selected.map(value => value.name).join(", "), 50))}
                                        MenuProps={MenuProps}
                                    >
                                        {functionsAndComponents.map((f) =>
                                            //@ts-ignore
                                            <MenuItem key={f[0].key} value={f[0]}>
                                                <Checkbox checked={!!requiredFunctions.includes(f[0])}/>
                                                <Tooltip disableFocusListener title={f[0].name + (f[1] != null ? " (" + f[1].name + ")" : "")}>
                                                    <ListItemText primary={formatFunctionOutput(f[0], f[1])}/>
                                                </Tooltip>
                                            </MenuItem>
                                        )}
                                    </Select>
                                    <IconButton className={classes.button} color="primary" component="span"
                                                onClick={handleSubmit(_handleCreateFunction)}>
                                        <AddIcon/>
                                    </IconButton>
                                </FormControl>
                            </FormGroup>
                        </Box>
                    </Box>
                }
            </List>
        </React.Fragment>
    );
}

export default ComponentFunctionsList;