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
import {FailureMode} from "@models/failureModeModel";
import {Mitigation} from "@models/mitigationModel";
import MitigationCreation from "@components/dialog/mitigation/MitigationCreation";
import {merge} from "lodash";

const stepTitles = ["Failure Mode", "Component", "Influenced Function", "Mitigation", "Confirmation"];

interface Props {
    buttonTitle: string,
    onConfirmationClick: (FailureMode) => void,

    initialFailureMode?: FailureMode,
    initialComponent?: Component,
    initialFunctions?: Function[],
    initialMitigation?: Mitigation,
}

const FailureModeStepper = ({
                                buttonTitle, onConfirmationClick,
                                initialFailureMode = null,
                                initialComponent = null,
                                initialFunctions = [],
                                initialMitigation = null
                            }: Props) => {
    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode | null>(initialFailureMode)
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(initialComponent)
    const [selectedFunctions, setSelectedFunctions] = useState<Function[]>(initialFunctions)
    const [selectedMitigation, setSelectedMitigation] = useState<Mitigation | null>(initialMitigation)

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleComponentSelected = (component: Component) => {
        setSelectedFunctions([])
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
                        <FunctionPicker selectedFunctions={selectedFunctions}
                                        onFunctionsSelected={setSelectedFunctions}/>
                    </FunctionsProvider>
                );
            case 3:
                return (
                    <MitigationCreation mitigation={selectedMitigation} onMitigationChanged={setSelectedMitigation}/>
                );
            case 4:
                return (
                    <FailureModeStepperConfirmation
                        component={selectedComponent}
                        componentFunctions={selectedFunctions}
                        failureMode={selectedFailureMode}
                        mitigation={selectedMitigation}/>
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
                return selectedFunctions.length > 0;
            case 3:
                return Boolean(selectedMitigation);
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

        const mitigation = (initialMitigation)? initialMitigation : {} as Mitigation;
        merge(mitigation, selectedMitigation);

        failureMode.component = selectedComponent
        failureMode.influencedFunctions = selectedFunctions
        failureMode.mitigation = mitigation

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