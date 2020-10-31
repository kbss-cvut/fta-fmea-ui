import * as React from "react";

import {
    Button,
    Dialog, FormControl, InputLabel, MenuItem, Select,
} from "@material-ui/core";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";
import {CreateGate, GateType} from "@models/eventModel";
import {useState} from "react";
import {DialogActions} from "@components/dialog/custom/DialogActions";
import useStyles from "@components/dialog/gate/GateDialog.styles";
import * as eventService from "@services/eventService"

type GateDialogProps = {
    treeNodeIri: string,
    onGateCreated: (TreeNode) => void,
    onClose: () => void
};

const GateDialog = ({treeNodeIri, onGateCreated, onClose}: GateDialogProps) => {
    const classes = useStyles()

    const [processing, setIsProcessing] = useState(false)
    const [gateType, setGateType] = useState<string>(GateType.OR.toString())

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setGateType(event.target.value as string);
    };

    const handleCreateGate = async () => {
        setIsProcessing(true)

        const newGate = await eventService.insertGate(treeNodeIri, {gateType: gateType} as CreateGate)

        setIsProcessing(false)
        onGateCreated(newGate)
        onClose()
    }

    return (
        <div>
            <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm">
                <DialogTitle id="form-dialog-title" onClose={onClose}>Create Gate</DialogTitle>
                <DialogContent dividers>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="gate-type-select-label">Type</InputLabel>
                        <Select
                            labelId="gate-type-select-label"
                            id="gate-type-select"
                            value={gateType}
                            onChange={handleChange}
                        >
                            {
                                Object.values(GateType).map(value => <MenuItem value={value}>{value}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button disabled={processing} color="primary" onClick={handleCreateGate}>
                        Create Gate
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GateDialog;