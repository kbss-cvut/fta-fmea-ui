import * as React from "react";

import {useState} from "react";
import {
    Button,
    Dialog,
} from "@material-ui/core";
import useStyles from "./FailureModeDialog.styles";
import ComponentPickerDialog from "@components/dialog/failureMode/content/ComponentPickerDialog";
import FunctionPickerDialog from "@components/dialog/failureMode/content/FunctionPickerDialog";
import FailureModeCreateDialog from "@components/dialog/failureMode/content/FailureModeCreateDialog";
import {Component} from "@models/componentModel";
import {Function} from "@models/functionModel";
import {FunctionsProvider} from "@hooks/useFunctions";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";

const FailureModeDialog = ({open, handleCloseDialog}) => {
    const classes = useStyles()

    const [selectedComponent, setSelectedComponent] = useState<Component>();
    const [selectedFunction, setSelectedFunction] = useState<Function>();

    return (
        <div>
            <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md"
                    fullWidth>
                <DialogTitle id="form-dialog-title" onClose={handleCloseDialog}>Create Failure Mode</DialogTitle>
                <DialogContent dividers>
                    <div className={classes.contentDiv}>
                        <ComponentPickerDialog setSelectedComponent={setSelectedComponent}/>
                        <FunctionsProvider componentUri={selectedComponent ? selectedComponent.iri : undefined}>
                            <FunctionPickerDialog setSelectedFunction={setSelectedFunction}
                                                  componentSelected={!!selectedComponent}/>
                        </FunctionsProvider>
                        <FailureModeCreateDialog selectedFunction={selectedFunction}
                                                 functionSelected={!!selectedFunction}
                                                 handleClose={handleCloseDialog}/>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default FailureModeDialog;