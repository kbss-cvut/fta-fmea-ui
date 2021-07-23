import * as React from "react";
import {
    Box, Checkbox, FormControl,
    IconButton, InputLabel,
    List, ListItem,
    ListItemSecondaryAction,
    ListItemText, MenuItem, Select,
    TextField, FormGroup,
} from "@material-ui/core";
import {useForm, Controller} from "react-hook-form";
import AddIcon from "@material-ui/icons/Add";
import useStyles from "@components/editor/system/menu/function/ComponentFunctionsList.styles";
import {useFunctions} from "@hooks/useFunctions";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "@components/dialog/function/FunctionPicker.schema";
import DeleteIcon from '@material-ui/icons/Delete';
import {CreateFunction, Function} from "@models/functionModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import {useState} from "react";

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
    const [functions, addFunction, removeFunction, addRequiredFunction, allFunctions] = useFunctions();
    const [requiredFunctions, setRequiredFunctions] = useState<Function[]>([]);

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

    const handleDeleteFunction = (funcToDelete: Function) => {
        requestConfirmation({
            title: 'Delete Function?',
            explanation: 'Are you sure you want to delete the function?',
            onConfirm: () => removeFunction(funcToDelete),
        })
    }

    const handleChange = (event) => {
        setRequiredFunctions(event.target.value);
    }

    // @ts-ignore
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
                <FormGroup>
                    <FormControl>
                        <Controller as={TextField} autoFocus margin="dense" id="name" label="Function Name"
                                    type="text" fullWidth name="name" control={control} defaultValue=""
                                    inputRef={register} error={!!errors.name} helperText={errors.name?.message}/>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="required-functions-multiselect-label">Required functions:</InputLabel>
                        <Select
                            labelId="required-functions-multiselect-label"
                            id="required-functions-multiselect"
                            multiple
                            value={requiredFunctions}
                            onChange={handleChange}
                            renderValue={(selected: any[]) => (selected.map(value => value.name).join(", "))}
                            MenuProps={MenuProps}
                        >
                            {(allFunctions || []).map((f) =>
                                //@ts-ignore
                                <MenuItem key={f.key} value={f}>
                                    <Checkbox checked={!!requiredFunctions.includes(f)}/>
                                    <ListItemText primary={f.name}/>
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


        </React.Fragment>
    );
}

export default ComponentFunctionsList;