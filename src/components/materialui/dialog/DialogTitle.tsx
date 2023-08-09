import * as React from "react";
import { withStyles } from 'tss-react/mui';
import MuiDialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {ClassNameMap, Theme} from "@mui/material";
import {createStyles} from "@mui/material/styles";

export const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

interface DialogTitleProps {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
    classes?: ClassNameMap<string>
}

export const DialogTitle = withStyles((props: DialogTitleProps) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle classes={classes} {...other}>
            {/*// TODO: This is hotfix since disableTypography is removed in MUIv5*/}
            {/*<Typography variant="h6">{children}</Typography>*/}
            { children }
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                    size="large">
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
}, styles);