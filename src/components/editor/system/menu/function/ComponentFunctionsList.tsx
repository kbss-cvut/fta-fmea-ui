import * as React from "react";
import {useState} from "react";
import {
    Box,
    FormControl,
    FormGroup,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Tooltip
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import useStyles from "@components/editor/system/menu/function/ComponentFunctionsList.styles";
import {useFunctions} from "@hooks/useFunctions";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "@components/dialog/function/FunctionPicker.schema";
import DeleteIcon from '@mui/icons-material/Delete';
import {Function} from "@models/functionModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import {Edit} from "@mui/icons-material";
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import {useNavigate} from "react-router-dom";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {useCurrentSystem} from "@hooks/useCurrentSystem";
import ComponentFunctionEdit from "@components/editor/system/menu/function/ComponentFunctionEdit";
import {formatOutput} from "@utils/formatOutputUtils";
import {FailureMode} from "@models/failureModeModel";
import {BehaviorType} from "@models/behaviorModel";
import FailureModesList from "@components/editor/failureMode/FailureModesList";
import {useFailureMode} from "@hooks/useFailureModes";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FunctionsList from '@components/editor/system/menu/function/FunctionsList';
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import {simplifyReferencesOfReferences} from "@utils/utils";
import SafeAutocomplete from "@components/materialui/SafeAutocomplete";

const ComponentFunctionsList = ({ component }) => {
    const { classes } = useStyles();
    const history = useNavigate();
    const [system] = useCurrentSystem()
    const [,,,,addFailureModeToFunction, removeFailureModeToFunction] = useFailureMode()
    const [requestConfirmation] = useConfirmDialog()
    const [functions, addFunction,, removeFunction,, allFunctions, generateFDTree,,, addExistingFunction] = useFunctions()
    const [requiredFunctions, setRequiredFunctions] = useState<Function[]>([]);
    const [selectedFunction, setSelectedFunction] = useState<Function>()
    const [selectedFailureModes, setSelectedFailureModes] = useState<FailureMode[]>([])
    const [behaviorType, setBehaviorType] = useState<BehaviorType>(BehaviorType.ATOMIC);
    const [childBehaviors, setChildBehaviors] = useState<Function[]>([]);
    const [showEdit, setShowEdit] = useState<boolean>(false)
	const [functionToAdd, setFunctionToAdd] = useState<Function>()
	const [showSnackbar] = useSnackbar()
	const [dialog, showDialog] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleShowDialog = () => {
		showDialog(true);
	};
	
	const closeDialogWindow = () => {
		setFunctionToAdd(null);
		showDialog(false);
	};

	const handleFunctionToAdd = () => {
		addExistingFunction(functionToAdd, component)
		closeDialogWindow();
	}

    const {register, handleSubmit, formState: { errors }, control, reset} = useForm({
        resolver: yupResolver(schema)
    });

    const _handleCreateFunction = (values: any) => {      
		let createFunction: Function = { name: values.name, requiredBehaviors: requiredFunctions, childBehaviors: childBehaviors, behaviorType: behaviorType}
        createFunction = simplifyReferencesOfReferences(createFunction);
		addFunction(createFunction).then(f => selectedFailureModes.forEach(fm => addFailureModeToFunction(fm.iri,f.iri)))
		reset(values)
        setSelectedFailureModes([])
        setRequiredFunctions([])
        setBehaviorType(BehaviorType.ATOMIC)
        setChildBehaviors([])
		setFunctionToAdd(null);
        setOpen(false);
    }
	
    const showEditForm = (funcToEdit: Function) => {
        setSelectedFunction(funcToEdit)
        setShowEdit(true)
    }

    const handleBehaviorTypeChange = (event) => {
        setBehaviorType(event.target.value);
        if (event.target.value === BehaviorType.ATOMIC) {
            setChildBehaviors([]);
        }
    };

    const updateFailureModes = (currentFailureModes: FailureMode[], selectedFailureModes: FailureMode[], functionIri: string) => {
        if (!Array.isArray(selectedFailureModes) && selectedFailureModes != null) {
            selectedFailureModes = [selectedFailureModes]
        }
        let currentFMIris = (currentFailureModes || []).map(fm => fm.iri)
        let selectedFMIris = (selectedFailureModes || []).map(fm => fm.iri)

        currentFMIris.forEach(fmIri => {
            if(!selectedFMIris.includes(fmIri)){
                removeFailureModeToFunction(fmIri,functionIri)
            }
        })
        selectedFMIris.forEach(fmIri =>{
            if(!currentFMIris.includes(fmIri)){
                addFailureModeToFunction(fmIri,functionIri)
            }
        })
    }

    const handleDeleteFunction = (funcToDelete: Function) => {
        requestConfirmation({
            title: 'Delete Function?',
            explanation: 'Are you sure you want to delete the function?',
            onConfirm: () => removeFunction(funcToDelete),
        })
    }

    const generateFunctionalDependencyTree = (functionUri: string, systemName:string, functionName: string) => {
        generateFDTree(functionUri, systemName, functionName).then(value => {
            history( `/fta/${extractFragment(value.iri)}`);
        })
    }

    // @ts-ignore
    return (
        <React.Fragment>
			<List>
				{showEdit ? (
					<ComponentFunctionEdit
						selectedFunction={selectedFunction}
                        setSelectedFunction={setSelectedFunction}
						selectedFailureModes={selectedFailureModes}
						setSelectedFailureModes={setSelectedFailureModes}
						setShowEdit={setShowEdit}
						updateFailureModes={updateFailureModes}
					/>
				) : (
					<Box>
						{functions.map((f) => (
							<ListItem key={f.iri}>
								<ListItemText primary={formatOutput(f.name, 35)} />
								<ListItemSecondaryAction>
									<IconButton className={classes.button} onClick={() => showEditForm(f)} size="large">
										<Edit />
									</IconButton>
									<Tooltip
										disableFocusListener
										title={
											Array.isArray(f.requiredBehaviors)
												? f.requiredBehaviors.map((func) => func.name).join(", ") || "None"
												: f.requiredBehaviors["name"]
										}
									>
										<IconButton
                                            className={classes.button}
                                            onClick={() => generateFunctionalDependencyTree(f.iri, system.name, f.name)}
                                            size="large">
											<DeviceHubIcon />
										</IconButton>
									</Tooltip>
									<IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDeleteFunction(f)}
                                        size="large">
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}

						<Box className={classes.functions}>
							<FormGroup>
								<FormControl>
									<Dialog
										open={open}
										onClose={handleClose}
										aria-labelledby="alert-dialog-title"
										aria-describedby="alert-dialog-description"
									>
										<DialogTitle id="alert-dialog-title">Unselect function's parts</DialogTitle>
										<DialogContent>
											<DialogContentText id="alert-dialog-description">
												Do you want to unselect all functions selected as parts and create new Function?
											</DialogContentText>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleClose}>No</Button>
											<Button onClick={handleSubmit(_handleCreateFunction)} autoFocus>
												Yes
											</Button>
										</DialogActions>
									</Dialog>
								</FormControl>
								<FormControl>
                                    <TextField
                                        autoFocus
                                        margin="normal"
                                        id="name"
                                        label="Function Name"
                                        type="text"
                                        fullWidth
                                        name="name"
                                        defaultValue=""
                                        error={!!errors.name}
                                        helperText={errors.name?.message} {...register("name")}
                                    />
								</FormControl>

								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">Function complexity:</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={behaviorType}
										label="Function complexity:"
										onChange={handleBehaviorTypeChange}
                                        margin={"dense"}
									>
										<MenuItem value={BehaviorType.ATOMIC}>Atomic</MenuItem>
										<MenuItem value={BehaviorType.AND}>And</MenuItem>
										<MenuItem value={BehaviorType.OR}>Or</MenuItem>
									</Select>
								</FormControl>

								{behaviorType != BehaviorType.ATOMIC && (
                                    <FunctionsList
                                        label={"Parts: "}
                                        selectedFunctions={childBehaviors}
                                        setSelectedFunctions={setChildBehaviors}
                                        transitiveClosure={[]}
                                    />
								)}

                                <FunctionsList
                                 label={"Required Functions"}
                                 selectedFunctions={requiredFunctions}
                                 setSelectedFunctions={setRequiredFunctions}
                                 transitiveClosure={[]}
                                />

								<FormControl>
									<FailureModesList
										label={"Failure modes: "}
										functionIri={""}
										selectedFailureModes={selectedFailureModes}
										setSelectedFailureModes={setSelectedFailureModes}
										setCurrentFailureModes={() => {}}
										transitiveClosure={[]}
									    allowCauses={false}
                                    />
                                    <Box className={classes.button}>
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            onClick={handleShowDialog}
                                            component="span"
                                        >
                                            Add existing
                                        </Button>

                                        <IconButton
                                            className={classes.button}
                                            color="primary"
                                            component="span"
                                            onClick={
                                                childBehaviors.length > 0 && behaviorType == BehaviorType.ATOMIC
                                                    ? handleClickOpen
                                                    : handleSubmit(_handleCreateFunction)
                                            }
                                            size="large">
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </FormControl>
                            </FormGroup>
                        </Box>
                        <Dialog open={dialog} onClose={handleShowDialog} fullWidth maxWidth="sm">
                            <DialogTitle>Add existing function </DialogTitle>
                            <DialogContent>
                                <SafeAutocomplete
                                    id="add-existing-function"
                                    useSafeOptions={true}
                                    options={allFunctions.filter(
                                        (el) => !el.component || el.component.iri !== component.iri
                                    )}
                                    onChangeCallback={(e, newValue: any) => {
                                        setFunctionToAdd(newValue);
                                        showSnackbar("Function's component will be changed", SnackbarType.INFO);
                                    }}
                                    getOptionLabel={(func) => {
                                        // TODO: Find out what the hell is going on here according to docs this has different signature https://mui.com/material-ui/api/autocomplete/
                                        // func.name + " (" + (func.component == null ? "None" : func.component.name) + ")"

                                        return "";
                                        }
                                    }
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} label="Existing functions" />}
                                />					
                            </DialogContent>
                            <DialogActions>
                                <Button color="primary" onClick={closeDialogWindow}>Cancel</Button>
                                <Button color="primary" onClick={handleFunctionToAdd}> Add</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                )}
            </List>
        </React.Fragment>
    );
}

export default ComponentFunctionsList;