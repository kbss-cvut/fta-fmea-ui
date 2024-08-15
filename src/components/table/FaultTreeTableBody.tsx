import React, { FC } from "react";
import { TableRow, TableCell, Button, Box, Tooltip, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useStyles from "./FaultTreeOverviewTable.styles";
import { FaultTree } from "@models/faultTreeModel";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { formatDate } from "@utils/utils";
import { ROUTES, Status } from "@utils/constants";

interface FaultTreeTableBodyProps {
  faultTrees: FaultTree[];
  handleFaultTreeContextMenu: (evt: any, faultTree: FaultTree) => void;
}

const FaultTreeTableBody: FC<FaultTreeTableBodyProps> = ({ faultTrees, handleFaultTreeContextMenu }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const redirectToPath = (routePath: string, faultTree: FaultTree) => {
    navigate(routePath);
  };

  const failureRate = (fr: number) => (
    <Tooltip title={fr}>
      <Typography>{fr?.toExponential(2)}</Typography>
    </Tooltip>
  );

  return (
    <>
      {faultTrees.map((faultTree, rowIndex) => {
        const routePath = ROUTES.FTA + `/${extractFragment(faultTree.iri)}`;
        const statusColor = faultTree?.status !== Status.OK ? "red" : "black";
        const editor = faultTree?.editor || faultTree?.creator;
        return (
          <TableRow key={rowIndex} className={classes.noBorder}>
            <TableCell className={classes.firstColumn}>{faultTree.name}</TableCell>
            <TableCell className={classes.tableCell}>{faultTree?.system?.name}</TableCell>
            <TableCell className={classes.tableCell}>{faultTree?.subSystem?.name}</TableCell>
            <TableCell style={{ color: statusColor }} className={classes.tableCell}>
              {failureRate(faultTree?.calculatedFailureRate)}
            </TableCell>
            <TableCell className={classes.tableCell}>{failureRate(faultTree?.fhaBasedFailureRate)}</TableCell>
            <TableCell className={classes.tableCell}>{failureRate(faultTree?.requiredFailureRate)}</TableCell>
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
