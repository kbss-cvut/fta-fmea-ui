import {Divider, IconButton, Typography} from "@material-ui/core";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import TableChartIcon from '@material-ui/icons/TableChart';
import * as React from "react";

export interface Props {
    onRestoreLayout: () => void,
    onExportDiagram: () => void,
    onConvertToTable?: () => void,
}

const DiagramOptions = ({onRestoreLayout, onExportDiagram, onConvertToTable}: Props) => {
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
                {
                    onConvertToTable &&
                    <IconButton color="primary" onClick={onConvertToTable} aria-label="convert">
                        <TableChartIcon/>
                    </IconButton>
                }
            </div>
            <Divider/>
        </React.Fragment>
    );
}

export default DiagramOptions;