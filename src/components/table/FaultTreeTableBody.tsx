import React, { FC } from "react";
import { TableRow, TableCell, Button, Box, Tooltip, Typography, useTheme, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useStyles from "./FaultTreeOverviewTable.styles";
import { FaultTree, getFaultTreeCalculationStatus } from "@models/faultTreeModel";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { findByIri, formatDate } from "@utils/utils";
import { ROUTES, Status } from "@utils/constants";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import { useSystems } from "@hooks/useSystems";
import { syncProblemIcon, warnIcon } from "@components/Icons";
import { calculationStatusMessages } from "@components/fta/FTAStatus";

interface FaultTreeTableBodyProps {
  faultTrees: FaultTree[];
  handleFaultTreeContextMenu: (evt: any, faultTree: FaultTree) => void;
}

const FaultTreeTableBody: FC<FaultTreeTableBodyProps> = ({ faultTrees, handleFaultTreeContextMenu }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const [systems] = useSystems();
  const [, setSelectedSystem] = useSelectedSystemSummaries();
  const redirectToPath = (routePath: string, faultTree: FaultTree) => {
    const ftaSystem = findByIri(faultTree?.system?.iri, systems);
    setSelectedSystem(ftaSystem);
    navigate(routePath);
  };

  const failureRate = (fr: number, icon = null) => (
    <Stack alignItems="center" direction="row" gap={0}>
      <Tooltip title={<span className={classes.hint}>{fr}</span>}>
        <Typography>{fr?.toExponential(2)}</Typography>
      </Tooltip>
      {!!icon && icon}
    </Stack>
  );

  return (
    <>
      {faultTrees.map((faultTree, rowIndex) => {
        const routePath = ROUTES.FTA + `/${extractFragment(faultTree.iri)}`;
        const calculationStatus = getFaultTreeCalculationStatus(faultTree);
        const syncStatusColor = calculationStatus.isOk ? theme.synchronized.color : theme.notSynchronized.color;

        const violatedRequirement =
          faultTree?.requiredFailureRate &&
          faultTree?.calculatedFailureRate &&
          faultTree?.calculatedFailureRate > faultTree?.requiredFailureRate;
        const violatedRequirementStatusColor = violatedRequirement
          ? theme.requirementViolation.color
          : theme.main.black;

        const editor = faultTree?.editor || faultTree?.creator;
        return (
          <TableRow key={rowIndex} className={classes.noBorder}>
            <TableCell className={classes.firstColumn}>{faultTree.name}</TableCell>
            <TableCell className={classes.tableCell}>{faultTree?.system?.name}</TableCell>
            <TableCell className={classes.tableCell}>{faultTree?.subSystem?.name}</TableCell>
            <TableCell style={{ color: syncStatusColor }} className={classes.tableCell}>
              {failureRate(
                faultTree?.calculatedFailureRate,
                !calculationStatus.isOk &&
                  faultTree?.calculatedFailureRate &&
                  syncProblemIcon(
                    calculationStatusMessages(calculationStatus.statusCodes, t),
                    calculationStatus.statusCodes?.length,
                  ),
              )}
            </TableCell>
            <TableCell className={classes.tableCell}>{failureRate(faultTree?.fhaBasedFailureRate)}</TableCell>
            <TableCell className={classes.tableCell} style={{ color: violatedRequirementStatusColor }}>
              {failureRate(
                faultTree?.requiredFailureRate,
                violatedRequirement &&
                  warnIcon(calculationStatusMessages(["faultEventMessage.requirementViolated"], t)),
              )}
            </TableCell>
            <TableCell className={classes.tableCell}>{formatDate(faultTree?.modified)}</TableCell>
            <TableCell className={classes.tableCell}>{formatDate(faultTree?.created)}</TableCell>
            <TableCell className={classes.tableCell}>{editor?.username}</TableCell>
            <TableCell className={classes.tableCell}>
              <Box className={classes.rowOptionsContainer}>
                <Button
                  variant="contained"
                  className={classes.editButton}
                  onClick={() => redirectToPath(routePath, faultTree)}
                >
                  {t("faultTreeOverviewTable.edit")}
                </Button>
                <MoreVertIcon
                  className={classes.moreButton}
                  onClick={(e: any) => handleFaultTreeContextMenu(e, faultTree)}
                />
              </Box>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default FaultTreeTableBody;
