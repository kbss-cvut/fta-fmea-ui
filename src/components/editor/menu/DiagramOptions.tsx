import { Divider, IconButton, Typography } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import TableChartIcon from "@mui/icons-material/TableChart";
import RouteIcon from "@mui/icons-material/Route";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import { ENVVariable } from "@utils/constants";
import useStyles from "@components/editor/menu/DiagramOptions.styles";

export interface Props {
  onApplyAutomaticLayout: () => void;
  onExportDiagram: () => void;
  onConvertToTable?: () => void;
  onCutSetAnalysis?: () => void;
  tableConversionAllowed?: boolean;
  rendering?: boolean;
}

const DiagramOptions = ({
  onApplyAutomaticLayout,
  onExportDiagram,
  onConvertToTable,
  onCutSetAnalysis,
  tableConversionAllowed = false,
  rendering,
}: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const tooltipText = (messageCode) => <Typography>{t(messageCode)}</Typography>;

  return (
    <>
      <Typography variant="h6" className={classes.menuTitle} gutterBottom>
        {t("diagramSidePanel.diagramOptions")}
      </Typography>
      <div>
        <Tooltip title={tooltipText("diagramSidePanel.autoLayoutToolTip")}>
          <IconButton color="primary" onClick={onApplyAutomaticLayout} aria-label="restore layout" size="large">
            <AccountTreeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={tooltipText("diagramSidePanel.exportToolTip")}>
          <IconButton color="primary" onClick={onExportDiagram} aria-label="save" size="large">
            <SaveAltIcon />
          </IconButton>
        </Tooltip>
        {!ENVVariable && tableConversionAllowed && (
          <IconButton color="primary" onClick={onConvertToTable} aria-label="convert" size="large">
            <TableChartIcon />
          </IconButton>
        )}
        {onCutSetAnalysis && (
          <Tooltip title={tooltipText("diagramSidePanel.cutsetToggleToolTip")}>
            <IconButton color="primary" onClick={onCutSetAnalysis} size="large">
              {rendering ? <CircularProgress size={24} /> : <RouteIcon />}
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Divider />
    </>
  );
};

export default DiagramOptions;
