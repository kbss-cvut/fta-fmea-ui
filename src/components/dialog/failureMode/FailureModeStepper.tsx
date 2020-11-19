import * as React from "react";
import {useEffect, useState} from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ComponentPicker from "@components/picker/component/ComponentPicker";
import {Component} from "@models/componentModel";
import {Function} from "@models/functionModel";
import {Button} from "@material-ui/core";
import FunctionPicker from "@components/picker/function/FunctionPicker";
import {ComponentsProvider} from "@hooks/useComponents";
import {FunctionsProvider} from "@hooks/useFunctions";
import useStyles from "@components/dialog/failureMode/FailureModeStepper.styles";
import FailureModeStepperConfirmation from "@components/dialog/failureMode/FailureModeStepperConfirmation";
import FailureModeCreationStep from "@components/dialog/failureMode/FailureModeCreationStep";
import {FailureMode} from "@models/failureModeModel";
import {FaultEvent} from "@models/eventModel";
import {useEventPathToRoot} from "@hooks/useEventPathToRoot";
import {findIndex} from "lodash";
import * as componentService from "@services/componentService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

const stepTitles = ["Component", "Influenced Function", "Effects", "Confirmation"];

interface Props {
    onClose: () => void,
}

const FailureModeStepper = ({onClose}: Props) => {
    const classes = useStyles();
    const [showSnackbar] = useSnackbar();

    const eventPath = useEventPathToRoot()
    const [eventNamesPath, setEventNamesPath] = useState([]);

    useEffect(() => {
        setEventNamesPath(eventPath.map(value => value.name))
        setEffects(eventPath)
    }, [eventPath])

    const [activeStep, setActiveStep] = useState(0);
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
    const [selectedFunction, setSelectedFunction] = useState<Function | null>(null)
    const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode | null>(null)
    const [effects, setEffects] = useState<FaultEvent[]>(eventPath)

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleComponentSelected = (component: Component) => {
        setSelectedFunction(null)
        setSelectedComponent(component)
    }

    const handleEventsPathChanged = (events: string[]) => {
        const selectedEvents = eventPath.filter(value => findIndex(events, (e) => e === value.name) > -1)
        setEffects(selectedEvents)
    }

    // TODO validation between steps

    const handleSteps = (step) => {
        switch (step) {
            case 0:
                return (
                    <ComponentsProvider>
                        <ComponentPicker selectedComponent={selectedComponent}
                                         onComponentSelected={handleComponentSelected}/>
                    </ComponentsProvider>
                );
            case 1:
                return (
                    <FunctionsProvider componentUri={selectedComponent?.iri}>
                        <FunctionPicker selectedFunction={selectedFunction} onFunctionSelected={setSelectedFunction}/>
                    </FunctionsProvider>
                );
            case 2:
                return (
                    <FailureModeCreationStep
                        failureMode={selectedFailureMode}
                        onFailureModeChanged={setSelectedFailureMode}
                        eventNamesPath={eventNamesPath}
                        onEventPathChanged={handleEventsPathChanged}/>
                );
            case 3:
                return (
                    <FailureModeStepperConfirmation
                        component={selectedComponent}
                        componentFunction={selectedFunction}
                        failureMode={selectedFailureMode}
                        effects={effects}/>
                )
            default:
                break;
        }
    };

    const nextButtonEnabled = (step) => {
        switch (step) {
            case 0:
                return Boolean(selectedComponent);
            case 1:
                return Boolean(selectedFunction);
            case 2:
                return Boolean(selectedFailureMode);
            default:
                return true;
        }
    };

    const stepperNavigation = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className={classes.navigationButtonsDiv}>
                        <Button variant="contained" color="primary" onClick={handleNext}
                                disabled={!nextButtonEnabled(step)}>
                            Next
                        </Button>
                    </div>
                );
            case stepTitles.length - 1:
                return (
                    <div className={classes.navigationButtonsDiv}>
                        <Button variant="contained" color="primary" onClick={handleBack}>Back</Button>
                        <Button color="primary" onClick={handleCreateFailureMode}>Create</Button>
                    </div>
                );
            default:
                return (
                    <div className={classes.navigationButtonsDiv}>
                        <Button variant="contained" color="primary" onClick={handleBack}>Back</Button>
                        <Button variant="contained" color="primary" onClick={handleNext}
                                disabled={!nextButtonEnabled(step)}>
                            Next
                        </Button>
                    </div>
                );
        }
    };

    const handleCreateFailureMode = () => {
        const createFailureMode = {
            name: selectedFailureMode.name,
            effects: effects,
            influencedFunction: selectedFunction
        } as FailureMode

        componentService.addFailureMode(selectedComponent.iri, createFailureMode)
            .then(r => {
                showSnackbar('Failure Mode Created', SnackbarType.SUCCESS)
                onClose()
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <React.Fragment>
            <Stepper
                activeStep={activeStep}
                style={{margin: "30px 0 15px"}}
                alternativeLabel
            >
                {stepTitles.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
            </Stepper>
            {handleSteps(activeStep)}
            {stepperNavigation(activeStep)}
        </React.Fragment>
    );
};

export default FailureModeStepper;