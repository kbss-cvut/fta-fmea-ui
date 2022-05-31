import * as React from "react";
import { useFailureMode } from "@hooks/useFailureModes";
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
  Typography,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import FailureModesList from "@components/editor/failureMode/FailureModesList";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {FailureMode, FailureModeType} from "@models/failureModeModel";
import { BehaviorType } from "@models/behaviorModel";
import useStyles from "../failureMode/ComponentFailureModesList.styles";
import { schema } from "@components/dialog/failureMode/FailureMode.schema";
import { useState } from "react";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import ComponentFailureModesEdit from "@components/editor/system/menu/failureMode/ComponentFailureModesEdit";
import { Autocomplete } from "@material-ui/lab";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const ComponentFailureModesList = ({ component }) => {
  const classes = useStyles();
  const [
      allFailureModes,
      createFailureMode,
      ,
      ,
      ,
      ,
      componentFailureModes,
      ,
      ,
      removeFailureMode,
      addExistingFailureMode,
  ] = useFailureMode();
  const [failureModeParts, setFailureModeParts] = useState<FailureMode[]>([]);
  const [showSnackbar] = useSnackbar();
  const [showEdit, setShowEdit] = useState(false);
  const [requiredFailureModes, setRequiredFailureModes] = useState<FailureMode[]>([]);
  const [behaviorType, setBehaviorType] = useState<BehaviorType>(BehaviorType.ATOMIC);
  const [failureModeType, setFMtype] = useState<FailureModeType>(FailureModeType.FailureMode);
  const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode>();
  const [requestConfirmation] = useConfirmDialog();
  const [failureModeToAdd, setFailureModeToAdd] = useState<FailureMode>();
  const [dialog, showDialog] = useState<boolean>(false);

    const showEditForm = (fm: FailureMode) => {
      setSelectedFailureMode(fm);
      setShowEdit(true);
  };

  const handleClickOpen = () => {
      showDialog(true);
  };

  const closeDialogWindow = () => {
      setFailureModeToAdd(null);
      showDialog(false);
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

    const handleFMTypeChange = (event) => {
        setFMtype(event.target.value);
        if(failureModeType === FailureModeType.FailureMode){
            setBehaviorType(BehaviorType.ATOMIC);
            setFailureModeParts([]);
        }
    };

  const _handleCreateFailureMode = (values: any) => {
      let failureMode: FailureMode = {
          name: values.name as string,
          behaviorType: behaviorType,
          failureModeType: failureModeType,
          component: component,
          requiredBehaviors: [],
          childBehaviors: [],
      };

      createFailureMode(failureMode, requiredFailureModes, failureModeParts);
      reset(values);
      setFailureModeParts([]);
      setRequiredFailureModes([]);
      setBehaviorType(BehaviorType.ATOMIC);
      setFMtype(FailureModeType.FailureMode);
  };

  const handleAddExistingFM = () => {
      addExistingFailureMode(failureModeToAdd);
      closeDialogWindow();
  };

  const handleDeleteFunction = (failureMode: FailureMode) => {
      requestConfirmation({
          title: "Delete Failure Mode?",
          explanation: "Are you sure you want to delete the failure mode?",
          onConfirm: () => removeFailureMode(failureMode),
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
                                      <IconButton className={classes.actionButton} onClick={() => showEditForm(fm)}>
                                          <Edit />
                                      </IconButton>
                                      <IconButton
                                          className={classes.actionButton}
                                          onClick={() => handleDeleteFunction(fm)}
                                      >
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
                              <InputLabel id="failure-mode-type">Failure Mode Type</InputLabel>
                              <Select
                                  labelId="failure-mode-type"
                                  id="failure-mode-type-select"
                                  value={failureModeType}
                                  label="Failure Mode Type"
                                  onChange={handleFMTypeChange}
                              >
                                  <MenuItem value={FailureModeType.FailureMode}>Failure Mode</MenuItem>
                                  <MenuItem value={FailureModeType.FailureModeCause}>Failure Mode Cause</MenuItem>
                              </Select>
                          </FormControl>
                          {failureModeType === FailureModeType.FailureMode
                              && (
                                  <React.Fragment>
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
                                                  setCurrentFailureModes={() => {
                                                  }}
                                                  transitiveClosure={[]}
                                              />
                                          </FormControl>
                                      )}
                                      <FormControl fullWidth>
                                          <FailureModesList
                                              label={"Required Failure Modes: "}
                                              functionIri={""}
                                              selectedFailureModes={requiredFailureModes}
                                              setSelectedFailureModes={setRequiredFailureModes}
                                              setCurrentFailureModes={() => {
                                              }}
                                              transitiveClosure={[]}
                                          />
                                      </FormControl>
                                  </React.Fragment>
                              )
                          }
                          <Box className={classes.actionButton}>
                              <Button color="primary" variant="outlined" onClick={handleClickOpen}
                                      component="span">
                                  Add existing
                              </Button>
                              <IconButton
                                  className={classes.actionButton}
                                  color="primary"
                                  component="span"
                                  onClick={handleSubmit(_handleCreateFailureMode)}
                              >
                                  <AddIcon/>
                              </IconButton>
                          </Box>
                      </FormGroup>
                  </Box>

                  <Dialog open={dialog} onClose={closeDialogWindow} fullWidth maxWidth="sm">
                      <DialogTitle>Add existing failure mode </DialogTitle>
                      <DialogContent>
                          <Autocomplete
                              id="add-existing-failure-mode"
                              options={[...allFailureModes]
                                  .filter(([fmIri, fm]) => ((fm.component && fm.component.iri) || "") !== component.iri)
                                  .map((value) => value[1])}
                              onChange={(event: any, newValue: any) => {
                                  setFailureModeToAdd(newValue);
                                  showSnackbar("Failure mode's component will be changed", SnackbarType.INFO);
                              }}
                              getOptionLabel={(option) =>
                                  option.name + " (" + (option.component == null ? "None" : option.component.name) + ")"
                              }
                              fullWidth
                              renderInput={(params) => <TextField {...params} label="Existing failure modes" />}
                          />
                      </DialogContent>
                      <DialogActions>
                          <Button color="primary" onClick={closeDialogWindow}>Cancel</Button>
                          <Button color="primary" onClick={handleAddExistingFM}>Add</Button>
                      </DialogActions>
                  </Dialog>
              </Box>
          )}
      </React.Fragment>
  );
};

export default ComponentFailureModesList;
