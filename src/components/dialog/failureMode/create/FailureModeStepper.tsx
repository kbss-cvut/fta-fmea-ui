import * as React from "react";
import {useState} from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ComponentPicker from "@components/dialog/component/ComponentPicker";
import {Component} from "@models/componentModel";
import {Button} from "@material-ui/core";
import {ComponentsProvider} from "@hooks/useComponents";
import useStyles from "./FailureModeStepper.styles";
import FailureModeStepperConfirmation from "./FailureModeStepperConfirmation";
import FailureModeCreationStep from "./FailureModeCreationStep";
import {FailureMode} from "@models/failureModeModel";
import {merge} from "lodash";

const stepTitles = ["Failure Mode", "Component", "Confirmation"];

interface Props {
    buttonTitle: string,
    onConfirmationClick: (FailureMode) => void,

    initialFailureMode?: FailureMode,
    initialComponent?: Component,
}

const FailureModeStepper = ({
                                buttonTitle, onConfirmationClick,
                                initialFailureMode = null,
                                initialComponent = null,
                            }: Props) => {
    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode | null>(initialFailureMode)
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(initialComponent)

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleComponentSelected = (component: Component) => {
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
            case 3:
                return (
                    <FailureModeStepperConfirmation
                        component={selectedComponent}
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
                        <Button color="primary" onClick={handleConfirmClicked}>{buttonTitle}</Button>
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

    const handleConfirmClicked = () => {
        const failureMode = (initialFailureMode) ? initialFailureMode : {} as FailureMode;
        merge(failureMode, selectedFailureMode);

        failureMode.component = selectedComponent

        onConfirmationClick(failureMode)
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