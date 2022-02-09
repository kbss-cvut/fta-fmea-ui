import { useConfirmDialog } from "@hooks/useConfirmDialog";
import { useFailureMode } from "@hooks/useFailureModes";
import { BehaviorType, FailureMode } from "@models/failureModeModel";
import * as React from "react";
import useStyles from "../failureMode/ComponentFailureModesList.styles";
import {
	Grid,
	Box,
	Checkbox,
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
	Tooltip,
	Typography,
} from "@material-ui/core";
import { schema } from "@components/dialog/failureMode/FailureMode.schema";
import FailureModesList from "@components/editor/failureMode/FailureModesList";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { useEffect } from "react";

const ComponentFailureModesEdit = (props: {
	selectedFailureMode: FailureMode;
	setSelectedFailureMode;
	setShowEdit;
}) => {
	const classes = useStyles();
	const [allFailureModes, createFailureMode, editFailureMode ,,,, componentFailureModes, addDependantFailureMode, removeDependantFailureMode] = useFailureMode();
	const [failureModeParts, setFailureModeParts] = React.useState<FailureMode[]>([]);
	const [requiredFailureModes, setRequiredFailureModes] = React.useState<FailureMode[]>([]);
	const [behaviorType, setBehaviorType] = React.useState<BehaviorType>(BehaviorType.ATOMIC);
	const [requestConfirmation] = useConfirmDialog();

	const { register, handleSubmit, errors, control, reset } = useForm({
		resolver: yupResolver(schema),
	});

	const hideEditForm = () => {
		props.setSelectedFailureMode([]);
        setBehaviorType(BehaviorType.ATOMIC)
        setFailureModeParts([])
        setRequiredFailureModes([])
		props.setShowEdit(false);
	};

	const processFailureModeUpdate = (currentFMs, selectedFMs, type) => {
		let currentFMIris = currentFMs.map((fm) => fm.iri);
		let selectedFMIris = selectedFMs.map((fm) => fm.iri);

        currentFMs.forEach((fm) => {
			if (!selectedFMIris.includes(fm.iri)) {
                removeDependantFailureMode(props.selectedFailureMode, fm, type);
                console.log("odstranuju req");
                
			}
		});

		selectedFMs.forEach((fm) => {
			if (!currentFMIris.includes(fm.iri)) {
                addDependantFailureMode(props.selectedFailureMode, fm, type);

				
                console.log("pridavam req");
                console.log(fm);
				console.log(fm.iri);
			}
		});
	};

	const updateFailureMode = (values: any) => {
        console.log(values)
        props.selectedFailureMode.name = values.name;
        props.selectedFailureMode.behaviorType = behaviorType;
        processFailureModeUpdate(props.selectedFailureMode.requiredBehaviors, requiredFailureModes, "requiredBehavior");
		processFailureModeUpdate(props.selectedFailureMode.childBehaviors, failureModeParts, "childBehavior");
        editFailureMode(props.selectedFailureMode).then((fm) => props.setSelectedFailureMode(fm))
        hideEditForm()
	};

	const handleBehaviorTypeChange = (event) => {
		setBehaviorType(event.target.value);
		if (event.target.value === BehaviorType.ATOMIC) {
			setFailureModeParts([]);
		}
		console.log(componentFailureModes);
	};

	useEffect(() => {
		if (
			!Array.isArray(props.selectedFailureMode.childBehaviors) &&
			props.selectedFailureMode.childBehaviors != null
		) {
			props.selectedFailureMode.childBehaviors = [props.selectedFailureMode.childBehaviors];
		}
		if (
			!Array.isArray(props.selectedFailureMode.requiredBehaviors) &&
			props.selectedFailureMode.requiredBehaviors != null
		) {
			props.selectedFailureMode.requiredBehaviors = [props.selectedFailureMode.requiredBehaviors];
		}

		setBehaviorType(props.selectedFailureMode.behaviorType);
		setFailureModeParts(
			props.selectedFailureMode.childBehaviors.map((fm) => allFailureModes.get(fm.iri))
		);
		setRequiredFailureModes(
			props.selectedFailureMode.requiredBehaviors.map((fm) => allFailureModes.get(fm.iri))
		);
	}, []);

	return (
		<React.Fragment>
			<Grid>
				<Box component="div" className={classes.editHeader}>
					<h4>Edit failure mode:</h4>
					<IconButton component="div" onClick={hideEditForm}>
						<CloseIcon />
					</IconButton>
				</Box>
				<Box>
					<FormGroup>
						<FormControl>
							<Controller
								as={TextField}
								autoFocus
								margin="dense"
								id="name"
								label="Failure mode name"
								type="text"
								fullWidth
								name="name"
								defaultValue={props.selectedFailureMode.name}
								control={control}
								inputRef={register}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">Behavior Type</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={behaviorType}
								label="Behavior type"
								onChange={handleBehaviorTypeChange}
							>
								<MenuItem value={BehaviorType.ATOMIC}>Atomic</MenuItem>
								<MenuItem value={BehaviorType.AND}>And</MenuItem>
								<MenuItem value={BehaviorType.OR}>Or</MenuItem>
							</Select>
						</FormControl>

						{behaviorType != BehaviorType.ATOMIC && (
							<FormControl fullWidth>
								<FailureModesList
									label={"Parts: "}
									functionIri={""}
									selectedFailureModes={failureModeParts}
									setSelectedFailureModes={setFailureModeParts}
									setCurrentFailureModes={() => {}}
								/>
							</FormControl>
						)}
						<FormControl fullWidth>
							<FailureModesList
								label={"Required Failure Modes: "}
								functionIri={""}
								selectedFailureModes={requiredFailureModes}
								setSelectedFailureModes={setRequiredFailureModes}
								setCurrentFailureModes={() => {}}
							/>
							<IconButton
								className={classes.actionButton}
								color="primary"
								component="span"
								onClick={handleSubmit(updateFailureMode)}
							>
								<AddIcon />
							</IconButton>
						</FormControl>
					</FormGroup>
				</Box>
			</Grid>
		</React.Fragment>
	);
};

export default ComponentFailureModesEdit;
