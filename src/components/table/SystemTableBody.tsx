import React, { FC } from "react";
import { TableRow, TableCell, Button, Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useStyles from "./FaultTreeOverviewTable.styles";
import { System } from "@models/systemModel";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { ROUTES } from "@utils/constants";

interface SystemTableBodyProps {
  systems: System[];
  handleSystemContextMenu: (evt: any, system: System) => void;
  selectedSystem: System | null;
}

const SystemTableBody: FC<SystemTableBodyProps> = ({ systems, handleSystemContextMenu, selectedSystem }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const redirectToPath = (routePath: string, system: System) => {
    navigate(routePath);
  };

  return (
    <>
      {systems.map((system, rowIndex) => {
        const routePath = ROUTES.SYSTEMS + `/${extractFragment(system.iri)}`;
        const bgColor = system?.iri === selectedSystem?.iri ? "lightgrey" : "transparent";

        return (
          <TableRow key={rowIndex} className={classes.noBorder} style={{ backgroundColor: bgColor }}>
            <TableCell className={classes.systemFirstColumn}>{system.name}</TableCell>
            <TableCell className={classes.tableCell}>{system.operationalDataFilter.minOperationalHours}</TableCell>
            <TableCell className={classes.tableCell}>
              <Box className={classes.rowOptionsContainer}>
                <Button
                  variant="contained"
                  className={classes.editButton}
                  onClick={() => redirectToPath(routePath, system)}
                >
                  {t("faultTreeOverviewTable.edit")}
                </Button>
                <MoreVertIcon className={classes.moreButton} onClick={(e: any) => handleSystemContextMenu(e, system)} />
              </Box>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default SystemTableBody;
