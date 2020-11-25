import * as React from "react";
import {useState} from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ComponentPicker from "@components/dialog/component/ComponentPicker";
import {Component} from "@models/componentModel";
import {Function} from "@models/functionModel";
import {Button} from "@material-ui/core";
import FunctionPicker from "@components/dialog/function/FunctionPicker";
import {ComponentsProvider} from "@hooks/useComponents";
import {FunctionsProvider} from "@hooks/useFunctions";
import useStyles from "./FailureModeStepper.styles";
import FailureModeStepperConfirmation from "./FailureModeStepperConfirmation";
import FailureModeCreationStep from "./FailureModeCreationStep";
import {CreateFailureMode, FailureMode} from "@models/failureModeModel";
import * as faultEventService from "@services/faultEventService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

const stepTitles = ["Failure Mode", "Component", "Influenced Function", "Confirmation"];

interface Props {
    eventIri: string,
    onFailureModeCreated: () => void,
    onClose: () => void,
}

const FailureModeStepper = ({eventIri, onFailureModeCreated, onClose}: Props) => {
    const classes = useStyles();
    const [showSnackbar] = useSnackbar();

    const [activeStep, setActiveStep] = useState(0);
    const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode | null>(null)
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
    const [selectedFunction, setSelectedFunction] = useState<Function | null>(null)

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleComponentSelected = (component: Component) => {
        setSelectedFunction(null)
        setSelectedComponent(component)
    }

    const handleSteps = (step) => {
        switch (step) {
            case 0:
                return (
                    <FailureModeCreationStep
                        failureMode={selectedFailureMode}
                        onFailureModeChanged={setSelectedFailureMode}/>
                );
            case 1:
                return (
                    <ComponentsProvider>
                        <ComponentPicker selectedComponent={selectedComponent}
                                         onComponentSelected={handleComponentSelected}/>
                    </ComponentsProvider>
                );
            case 2:
                return (
                    <FunctionsProvider componentUri={selectedComponent?.iri}>
                        <FunctionPicker selectedFunction={selectedFunction} onFunctionSelected={setSelectedFunction}/>
                    </FunctionsProvider>
                );
            case 3:
                return (
                    <FailureModeStepperConfirmation
                        component={selectedComponent}
                        componentFunction={selectedFunction}
                        failureMode={selectedFailureMode}/>
                )
            default:
                break;
        }
    };

    const nextButtonEnabled = (step) => {
        switch (step) {
            case 0:
                return Boolean(selectedFailureMode);
            case 1:
                return Boolean(selectedComponent);
            case 2:
                return Boolean(selectedFunction);
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
            component: selectedComponent,
            influencedFunctions: [selectedFunction]
        } as CreateFailureMode

        faultEventService.addFailureMode(eventIri, createFailureMode)
            .then(value => {
                showSnackbar('Failure Mode Created', SnackbarType.SUCCESS)
                onFailureModeCreated()
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