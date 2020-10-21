import * as React from "react";

import {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@material-ui/core";
import * as componentService from "@services/componentService"

const CreateComponentDialog = ({handleComponentCreated, dialogOpen, handleCloseDialog}) => {
    const [processing, setProcessing] = useState(false)
    const [name, setName] = useState<string>()

    const handleCreate = async () => {
        // TODO validate name
        setProcessing(true)

        const newComponent = await componentService.create({name: name});

        setProcessing(false)
        handleComponentCreated(newComponent)
    }

    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md"
                    fullWidth={true}>
                <DialogTitle id="form-dialog-title">Create Component</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" id="name" label="Component Name" type="text" fullWidth
                               onChange={(e) => setName(e.target.value)}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} color="primary" disabled={processing}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateComponentDialog;