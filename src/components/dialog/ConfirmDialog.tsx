import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
    title: string,
    explanation: string,
    onConfirm: () => void,
    open: boolean,
    onClose: () => void,
}

const ConfirmDialog = ({title, explanation, open, onClose, onConfirm}: Props) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <DialogContent>{explanation}</DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={onClose}
                    color="secondary">
                    No
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        onClose();
                        onConfirm();
                    }}
                    color="default">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDialog;