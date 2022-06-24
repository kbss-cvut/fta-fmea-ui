import * as React from "react";
import {Button, Dialog, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {useForm} from "react-hook-form";
import {DialogTitle} from "../../../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../../../materialui/dialog/DialogContent";
import {DialogActions} from "../../../../materialui/dialog/DialogActions";
import {useState} from "react";
import {useDocuments} from "@hooks/useDocuments";
import {useCurrentSystem} from "@hooks/useCurrentSystem";
import {DocumentModel} from "@models/documentModel";

const ImportDocumentDialog = ({open, handleCloseDialog}) => {
    const [showSnackbar] = useSnackbar();
    const [system,,,,fetchSystem] = useCurrentSystem()
    const [documents, importDocument] = useDocuments();
    const [document, setDocument] = useState<DocumentModel>(undefined);

    const {handleSubmit} = useForm();

    const handleImportDocument = async () => {
        importDocument(system.iri, document.iri)
            .then(() => {
                showSnackbar("Document imported successfully",SnackbarType.SUCCESS)
                fetchSystem()
            })
            .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));

        handleCloseDialog()
    }

    const handleSetDocument = (event) => {
        setDocument(event.target.value)
    }

    return (
        <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md"
                fullWidth>
            <form onSubmit={handleSubmit(handleImportDocument)} noValidate>
                <DialogTitle id="form-dialog-title" onClose={handleCloseDialog}> Select annotated document</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Documents:</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue=""
                            value={document ? document : ""}
                            label="Documents"
                            onChange={handleSetDocument}
                        >
                            {documents.map(document => {
                                // @ts-ignore
                                return <MenuItem key={document.iri} value={document}>{document.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" type="submit">Cancel</Button>
                    <Button onClick={handleImportDocument} color="primary" type="submit">
                        Import document
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ImportDocumentDialog;