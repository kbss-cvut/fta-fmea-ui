import * as React from "react";
import {
    Box, Checkbox, FormControl,
    IconButton, InputLabel,
    List, ListItem,
    ListItemSecondaryAction,
    ListItemText, MenuItem, Select,
    TextField, FormGroup, Tooltip
} from "@material-ui/core";
import {useForm, Controller} from "react-hook-form";
import AddIcon from "@material-ui/icons/Add";
import useStyles from "@components/editor/system/menu/function/ComponentFunctionsList.styles";
import {useFunctions} from "@hooks/useFunctions";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "@components/dialog/function/FunctionPicker.schema";
import DeleteIcon from '@material-ui/icons/Delete';
import { Function} from "@models/functionModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import {useState} from "react";
import {Edit} from "@material-ui/icons";
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import {useHistory} from "react-router-dom";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {useCurrentSystem} from "@hooks/useCurrentSystem";
import ComponentFunctionEdit from "@components/editor/system/menu/function/ComponentFunctionEdit";
import {formatFunctionOutput, formatOutput} from "@utils/formatOutputUtils";

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
    const history = useHistory();
    const [system] = useCurrentSystem()
    const [requestConfirmation] = useConfirmDialog()
    const [functions, addFunction,, removeFunction,,, functionsAndComponents,generateFDTree] = useFunctions()
    const [requiredFunctions, setRequiredFunctions] = useState<Function[]>([]);
    const [selectedFunction, setSelectedFunction] = useState<Function>()
    const [showEdit, setShowEdit] = useState<boolean>(false)

    const {register, handleSubmit, errors, control, reset} = useForm({
        resolver: yupResolver(schema)
    });
    const _handleCreateFunction = (values: any) => {
        let createFunction: Function = {name: values.name, requiredFunctions: requiredFunctions,failureModes: []}
        addFunction(createFunction)
        reset(values)
        setRequiredFunctions([])
    }

    const showEditForm = (funcToEdit: Function) => {
        setSelectedFunction(funcToEdit)
        setShowEdit(true)
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

    const generateFunctionalDependencyTree = (functionUri: string, systemName:string, functionName: string) => {
        generateFDTree(functionUri, systemName, functionName).then(value => {
            history.replace( `/fta/${extractFragment(value.iri)}`);
        })
    }

    // @ts-ignore
    return (
        <React.Fragment>
            <List>
                {showEdit
                    ? <ComponentFunctionEdit selectedFunction={selectedFunction} setShowEdit={setShowEdit}/>
                    : <Box>
                        {functions.map(f => <ListItem>
                            <ListItemText primary={formatOutput(f.name, 35)}/>
                            <ListItemSecondaryAction>
                                <IconButton className={classes.button} onClick={() => showEditForm(f)}>
                                    <Edit/>
                                </IconButton>
                                <Tooltip disableFocusListener
                                         title={Array.isArray(f.requiredFunctions) ? f.requiredFunctions.map(func => func.name).join(", ") || "None" : f.requiredFunctions['name']}>
                                    <IconButton className={classes.button} onClick={() => generateFunctionalDependencyTree(f.iri, system.name, f.name)}>
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