import { Divider, Button, IconButton, Typography } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import TableChartIcon from "@mui/icons-material/TableChart";
import RouteIcon from "@mui/icons-material/Route";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";

export interface Props {
  onRestoreLayout: () => void;
  onExportDiagram: () => void;
  onConvertToTable?: () => void;
  onCutSetAnalysis?: () => void;
  tableConversionAllowed?: boolean;
}

const DiagramOptions = ({
  onRestoreLayout,
  onExportDiagram,
  onConvertToTable,
  onCutSetAnalysis,
  tableConversionAllowed = false,
}: Props) => {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Diagram Options
      </Typography>
      <div>
        <IconButton color="primary" onClick={onRestoreLayout} aria-label="restore layout" size="large">
          <AccountTreeIcon />
        </IconButton>
        <IconButton color="primary" onClick={onExportDiagram} aria-label="save" size="large">
          <SaveAltIcon />
        </IconButton>
        {tableConversionAllowed && (
          <IconButton color="primary" onClick={onConvertToTable} aria-label="convert" size="large">
            <TableChartIcon />
          </IconButton>
        )}
        {onCutSetAnalysis && (
          <Tooltip title="Cutset">
            <IconButton color="primary" onClick={onCutSetAnalysis} size="large">
              <RouteIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Divider />
    </React.Fragment>
  );
};

export default DiagramOptions;
