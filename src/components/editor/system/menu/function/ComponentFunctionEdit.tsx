import { Function } from "@models/functionModel";
import * as React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "@components/editor/system/menu/function/ComponentFunctionsList.styles";
import { useFunctions } from "@hooks/useFunctions";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "@components/dialog/function/FunctionPicker.schema";
import { formatFunctionOutput, formatOutput } from "@utils/formatOutputUtils";
import FailureModesList from "@components/editor/failureMode/FailureModesList";
import { BehaviorType, FailureMode } from "@models/failureModeModel";
import { checkArray } from "@utils/validationUtils";
import { Component } from "@models/componentModel";

interface MyProps {
  selectedFunction: Function;
  selectedFailureModes: FailureMode[];
  setSelectedFunction;
  setShowEdit;
  updateFailureModes;
  setSelectedFailureModes;
  functionsAndComponents: [Function, Component][];
}

const ComponentFunctionsList: React.FC<MyProps> = (props: MyProps) => {
  const classes = useStyles();
  const [,, editFunction,,, allFunctions, functionsAndComponents,,, getTransitiveClosure] = useFunctions();
  const [requiredFunctions, setRequiredFunctions] = useState<Function[]>([]);
  const [currentFailureModes, setCurrentFailureModes] = useState<FailureMode[]>([]);
  const [childBehaviors, setChildBehaviors] = useState<Function[]>([]);
  const [open, setOpen] = React.useState(false);
  const [behaviorType, setBehaviorType] = useState<BehaviorType>(BehaviorType.ATOMIC);
  const [requiredTransitiveClosure, setRequiredTransitiveClosure] = useState<string[]>([]);
  const [childTransitiveClosure, setChildTransitiveClosure] = useState<string[]>([]);


  const { register, handleSubmit, errors, control } = useForm({
    resolver: yupResolver(schema),
  });

  const hideEditForm = () => {
    setRequiredFunctions([]);
    props.setSelectedFailureModes([]);
    props.setShowEdit(false);
  };

  const handleBehaviorTypeChange = (event) => {
    if (event.target.value === BehaviorType.ATOMIC && childBehaviors.length) {
      setOpen(true);
    } else setBehaviorType(event.target.value);
  };

  const handleChildBehaviorChange = (event) => {
    setChildBehaviors(event.target.value);
  };
  const handleEditFunction = (funcToEdit: Function) => {
    props.selectedFunction.name = funcToEdit.name;
    props.selectedFunction.requiredFunctions = requiredFunctions;
    props.selectedFunction.childBehaviors = childBehaviors;
    props.selectedFunction.behaviorType = behaviorType;
    editFunction(props.selectedFunction).then((f) => {props.setSelectedFunction(f)});
    props.updateFailureModes(currentFailureModes, props.selectedFailureModes, props.selectedFunction.iri);
    setRequiredFunctions([]);
    props.setSelectedFailureModes([]);
    props.setShowEdit(false);
  };

  const handleChange = (event) => {
    setRequiredFunctions(event.target.value);
  };

  const unselectFunctions = () => {
    setChildBehaviors([]);
    setBehaviorType(BehaviorType.ATOMIC);
    setOpen(false);
  };

  const changeType = () => {
    setOpen(false);
  };

  useEffect(() => {
    setBehaviorType(props.selectedFunction.behaviorType);
    props.selectedFunction.requiredFunctions = checkArray(props.selectedFunction.requiredFunctions);
    props.selectedFunction.childBehaviors = checkArray(props.selectedFunction.childBehaviors);
    
    setChildBehaviors(
        props.selectedFunction.childBehaviors.map((f) => allFunctions.find(func => func.iri == f.iri))
    );

    setRequiredFunctions(
        props.selectedFunction.requiredFunctions.map((f) => allFunctions.find(func => func.iri == f.iri))
    );

    getTransitiveClosure(props.selectedFunction.iri, "child").then(value => {
        setChildTransitiveClosure(value)    
    })

    getTransitiveClosure(props.selectedFunction.iri, "required").then(value => {
        setRequiredTransitiveClosure(value)
    })
   
  }, []);

  return (
      <Grid>
          <Box component="div" className={classes.editHeader}>
              <h4>Edit function:</h4>   
              <IconButton component="div" onClick={handleSubmit(hideEditForm)}>
                  <CloseIcon />
              </IconButton>
          </Box>
          <Box className={classes.functions}>
              <FormGroup>
                  <Dialog
                      open={open}
                      onClose={() => setOpen(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                  >
                      <DialogTitle id="alert-dialog-title"> Unselect function parts </DialogTitle>
                      <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                              Do you want to unselect all functions selected as parts?
                          </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                          <Button color="primary" onClick={changeType}>
                              Abort
                          </Button>
                          <Button color="primary" onClick={unselectFunctions} autoFocus>
                              Yes, unselect
                          </Button>
                      </DialogActions>
                  </Dialog>

                  <FormControl>
                      <Controller
                          as={TextField}
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Function Name"
                          type="text"
                          fullWidth
                          name="name"
                          control={control}
                          defaultValue={props.selectedFunction.name}
                          inputRef={register}
                          error={!!errors.name}
                          helperText={errors.name?.message}
                      />
                  </FormControl>

                  <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Function complexity:</InputLabel>
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
                          <InputLabel id="required-functions-multiselect-label">Parts:</InputLabel>
                          <Select
                              labelId="required-functions-multiselect-label"
                              id="required-functions-multiselect"
                              multiple
                              value={childBehaviors}
                              onChange={handleChildBehaviorChange}
                              renderValue={(selected: any[]) =>
                                  formatOutput(selected.map((value) => value.name).join(", "), 50)
                              }
                          >
                              {props.functionsAndComponents.map((f) => (
                                  //@ts-ignore
                                   <MenuItem key={f[0].iri} value={f[0]} className={(childTransitiveClosure.includes(f[0].iri) ? classes.closure : "")} >                                   
                                      <Checkbox checked={!!childBehaviors.includes(f[0])} />
                                      <Tooltip
                                          disableFocusListener
                                          title={f[0].name + (f[1] && " (" + f[1].name + ")")}
                                      >
                                          <ListItemText primary={formatFunctionOutput(f[0], f[1])} />
                                      </Tooltip>
                                  </MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                  )}

                  <FormControl>
                      <InputLabel shrink={requiredFunctions.length != 0} id="required-functions-multiselect-label1">
                          Required functions:
                      </InputLabel>
                      <Select
                          labelId="required-functions-multiselect-label1"
                          id="required-functions-multiselect"
                          multiple
                          value={requiredFunctions}
                          onChange={handleChange}
                          renderValue={(selected: any[]) =>
                              formatOutput(selected.map((value) => value.name).join(", "), 65)
                          }
                      >
                          {functionsAndComponents.map((f) => (
                              //@ts-ignore
                              <MenuItem key={f[0].iri} value={f[0]} className={(requiredTransitiveClosure.includes(f[0].iri) ? classes.closure : "")}>
                                  <Checkbox checked={requiredFunctions.includes(f[0])} />
                                  <Tooltip
                                      disableFocusListener
                                      title={f[0].name + (f[1] != null ? " (" + f[1].name + ")" : "")}
                                  >
                                      <ListItemText primary={formatFunctionOutput(f[0], f[1])} />
                                  </Tooltip>
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  <FormControl>
                      <FailureModesList
                          label={"Failure modes: "}
                          functionIri={props.selectedFunction.iri}
                          selectedFailureModes={props.selectedFailureModes}
                          setSelectedFailureModes={props.setSelectedFailureModes}
                          setCurrentFailureModes={setCurrentFailureModes}
                          transitiveClosure={[]}
                      />
                      <IconButton
                          className={classes.button}
                          color="primary"
                          component="span"
                          onClick={handleSubmit(handleEditFunction)}
                      >
                          <Edit />
                      </IconButton>
                  </FormControl>
              </FormGroup>
          </Box>
      </Grid>
  );
};

export default ComponentFunctionsList;
