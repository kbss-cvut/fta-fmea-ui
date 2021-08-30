import {Function} from "@models/functionModel";
import * as React from "react";
import {useForm, Controller} from "react-hook-form";
import {
    Box,
    Checkbox, FormControl,
    FormGroup,
    Grid,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem, Select,
    TextField,
    Tooltip
} from "@material-ui/core";
import {Edit} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "@components/editor/system/menu/function/ComponentFunctionsList.styles";
import {useFunctions} from "@hooks/useFunctions";
import {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "@components/dialog/function/FunctionPicker.schema";
import {editFunction} from "@services/functionService";
import {formatFunctionOutput, formatOutput} from "@utils/formatOutputUtils";


const ComponentFunctionsList = (props: { selectedFunction: Function, setShowEdit}) => {
    const classes = useStyles();

    const [,,,,,allFunctions,functionsAndComponents] = useFunctions()
    const [requiredFunctions, setRequiredFunctions] = useState<Function[]>([]);
    const {register, handleSubmit, errors, control} = useForm({
        resolver: yupResolver(schema)
    });

    const hideEditForm = () => {
        setRequiredFunctions([])
        props.setShowEdit(false)
    }



    const handleEditFunction = (funcToEdit: Function) => {
        props.selectedFunction.name = funcToEdit.name
        props.selectedFunction.requiredFunctions = requiredFunctions
        editFunction(props.selectedFunction)
        setRequiredFunctions([])
        props.setShowEdit(false)
    }

    const handleChange = (event) => {
        setRequiredFunctions(event.target.value)
    }

    useEffect(()=>{
        if (!Array.isArray(props.selectedFunction.requiredFunctions)) {
            props.selectedFunction.requiredFunctions = [props.selectedFunction.requiredFunctions]
        }
        props.selectedFunction.requiredFunctions.forEach(func => {
            requiredFunctions.push(allFunctions.find(f => f.iri == func.iri))
        })
    },[])


    return(
        <Grid>
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
                                    defaultValue={props.selectedFunction.name}
                                    inputRef={register} error={!!errors.name}
                                    helperText={errors.name?.message}/>
                    </FormControl>
                    <FormControl>
                        <InputLabel shrink={true} id="required-functions-multiselect-label1">Required
                            functions:</InputLabel>
                        <Select
                            labelId="required-functions-multiselect-label1"
                            id="required-functions-multiselect"
                            multiple
                            value={requiredFunctions}
                            onChange={handleChange}
                            renderValue={(selected: any[]) => formatOutput(selected.map(value => value.name).join(", "), 65)}
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
    );
}

export default ComponentFunctionsList;