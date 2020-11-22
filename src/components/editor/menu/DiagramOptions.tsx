import {Divider, IconButton, Typography} from "@material-ui/core";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import * as React from "react";

export interface Props {
    onRestoreLayout: () => void,
    onExportDiagram: () => void,
}

const DiagramOptions = ({onRestoreLayout, onExportDiagram}: Props) => {
    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Diagram Options</Typography>
            <div>
                <IconButton color="primary" onClick={onRestoreLayout} aria-label="restore layout">
                    <AccountTreeIcon/>
                </IconButton>
                <IconButton color="primary" onClick={onExportDiagram} aria-label="save">
                    <SaveAltIcon/>
                </IconButton>
            </div>
            <Divider/>
        </React.Fragment>
    );
}

export default DiagramOptions;