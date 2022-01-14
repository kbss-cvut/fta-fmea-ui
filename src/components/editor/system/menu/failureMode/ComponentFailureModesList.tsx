import * as React from "react";
import { useFailureMode } from "@hooks/useFailureModes";
import {
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
import { Edit } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import FailureModesList from "@components/editor/failureMode/FailureModesList";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BehaviorType, FailureMode } from "@models/failureModeModel";
import useStyles from "../failureMode/ComponentFailureModesList.styles";
import { schema } from "@components/dialog/failureMode/FailureMode.schema";
import { useEffect, useState } from "react";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import ComponentFailureModesEdit from "@components/editor/system/menu/failureMode/ComponentFailureModesEdit";

const ComponentFailureModesList = ({ component }) => {
  const classes = useStyles();
  const [allFailureModes, createFailureMode, , , , , componentFailureModes,,,removeFailureMode] = useFailureMode();
  const [failureModeParts, setFailureModeParts] = useState<FailureMode[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [requiredFailureModes, setRequiredFailureModes] = useState<FailureMode[]>([]);
  const [behaviorType, setBehaviorType] = useState<BehaviorType>(BehaviorType.ATOMIC);
  const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode>();
  const [requestConfirmation] = useConfirmDialog();

  const showEditForm = (fm: FailureMode) => {
    setSelectedFailureMode(fm);
    setShowEdit(true);
  };

  const { register, handleSubmit, errors, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleBehaviorTypeChange = (event) => {
    setBehaviorType(event.target.value);
    if (event.target.value === BehaviorType.ATOMIC) {
      setFailureModeParts([]);
    }
  };

  const _handleCreateFailureMode = (values: any) => {
    let failureMode: FailureMode = {
      name: values.name as string,
      behaviorType: behaviorType,
      component: component,
      requiredBehaviors: [],
      childBehaviors: []
    };

    createFailureMode(failureMode, requiredFailureModes, failureModeParts);
    reset(values);
    setFailureModeParts([]);
    setRequiredFailureModes([]);
    setBehaviorType(BehaviorType.ATOMIC);
  };

  const handleDeleteFunction = (failureMode: FailureMode) => {
    requestConfirmation({
      title: "Delete Failure Mode?",
      explanation: "Are you sure you want to delete the failure mode?",
      onConfirm: () => removeFailureMode(failureMode)
    });
  };

  return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Failure Modes
        </Typography>

        {showEdit ? (
            <ComponentFailureModesEdit
                selectedFailureMode={selectedFailureMode}
                setShowEdit={setShowEdit}
                setSelectedFailureMode={setSelectedFailureMode}
            />
        ) : (
            <Box>
              <List>
                <Box>
                  {componentFailureModes.map((fm) => (
                      <ListItem key={fm.iri}>
                        <ListItemText primary={fm.name} />
                        <ListItemSecondaryAction>
                          <IconButton className={classes.button} onClick={() => showEditForm(fm)}>
                            <Edit />
                          </IconButton>
                          <IconButton className={classes.button} onClick={() => handleDeleteFunction(fm)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                  ))}
                </Box>
              </List>

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
                        defaultValue=""
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
                        className={classes.button}
                        color="primary"
                        component="span"
                        onClick={handleSubmit(_handleCreateFailureMode)}
                    >
                      <AddIcon />
                    </IconButton>
                  </FormControl>
                </FormGroup>
              </Box>
            </Box>
        )}
      </React.Fragment>
  );
};

export default ComponentFailureModesList;
