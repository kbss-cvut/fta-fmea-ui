import {Divider, IconButton, Typography} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import TableChartIcon from '@mui/icons-material/TableChart';
import * as React from "react";

export interface Props {
    onRestoreLayout: () => void,
    onExportDiagram: () => void,
    onConvertToTable?: () => void,
    tableConversionAllowed?: boolean,
}

const DiagramOptions = ({onRestoreLayout, onExportDiagram, onConvertToTable, tableConversionAllowed = false}: Props) => {
    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Diagram Options</Typography>
            <div>
                <IconButton
                    color="primary"
                    onClick={onRestoreLayout}
                    aria-label="restore layout"
                    size="large">
                    <AccountTreeIcon/>
                </IconButton>
                <IconButton color="primary" onClick={onExportDiagram} aria-label="save" size="large">
                    <SaveAltIcon/>
                </IconButton>
                {
                    tableConversionAllowed &&
                    <IconButton
                        color="primary"
                        onClick={onConvertToTable}
                        aria-label="convert"
                        size="large">
                        <TableChartIcon/>
                    </IconButton>
                }
            </div>
            <Divider/>
        </React.Fragment>
    );
}

export default DiagramOptions;