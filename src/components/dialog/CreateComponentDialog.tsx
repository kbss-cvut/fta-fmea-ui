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
import {useComponents} from "@hooks/useComponents";

const CreateComponentDialog = ({open, handleCloseDialog}) => {
    const [name, setName] = useState<string>()
    const [_, addComponent] = useComponents()

    const handleCreate = async () => {
        // TODO validation

        addComponent({name: name})
        handleCloseDialog()
    }

    return (
        <div>
            <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md"
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
                    <Button onClick={handleCreate} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateComponentDialog;