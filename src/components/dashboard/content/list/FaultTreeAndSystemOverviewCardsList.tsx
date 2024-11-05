import React, { FC, useState } from "react";
import { Box, Grid, Typography, Button, useTheme, CircularProgress } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useStyles from "./FaultTreeOverviewCardsList.styles";
import { useTranslation } from "react-i18next";
import { FaultTree } from "@models/faultTreeModel";
import { ROUTES } from "@utils/constants";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { useNavigate } from "react-router-dom";
import { System } from "@models/systemModel";
import { getReorderedSystemsListbySystem } from "@utils/utils";

const borderDefault = "1px solid #E0E0E0";
const borderHover = "1px solid #60A3D9";

interface FaultTreeOverviewCardsListProps {
  faultTrees?: FaultTree[];
  systems?: System[];
  loading: boolean;
  handleFaultTreeContextMenu?: (evt: any, faultTree: FaultTree) => void;
  handleSystemContextMenu?: (evt: any, system: System) => void;
  selectedSystem: System | null;
}

interface CardProps {
  name: string;
  onRedirect: (e: any) => void;
  onOpenMenu: (e: any) => void;
  border: string;
  index: number;
  systemIri?: string;
}

const FaultTreeAndSystemOverviewCardsList: FC<FaultTreeOverviewCardsListProps> = ({
  faultTrees,
  systems,
  loading,
  handleFaultTreeContextMenu,
  handleSystemContextMenu,
  selectedSystem,
}) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const modifiedSystemsList = getReorderedSystemsListbySystem(systems, selectedSystem);

  const Card: FC<CardProps> = ({ name, onRedirect, onOpenMenu, border, index, systemIri }) => {
    const bgColor = systemIri === selectedSystem?.iri ? theme.sidePanel.colors.hover : "transparent";
    return (
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <Box
          className={classes.cardContainer}
          style={{ border: border, backgroundColor: bgColor }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Box className={classes.cardHalfContainer}>
            <Typography>{name}</Typography>
            <MoreHorizIcon style={{ cursor: "pointer" }} onClick={onOpenMenu} />
          </Box>
          <Box className={classes.cardHalfContainer}>
            <Button variant="contained" onClick={onRedirect}>
              <Typography>{t("faultTreeOverviewTable.edit")}</Typography>
            </Button>
          </Box>
        </Box>
      </Grid>
    );
  };
  if (loading)
    return (
      <div style={{ display: "flex", height: "50vh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress style={{ alignContent: "center" }} size={100} />
      </div>
    );
  return (
    <Box style={{ flex: 1 }}>
      <Grid container spacing={2} className={classes.grid}>
        {faultTrees &&
          faultTrees.map((faultTree, index) => {
            const border = hoveredIndex === index ? borderHover : borderDefault;
            const routePath = ROUTES.FTA + `/${extractFragment(faultTree.iri)}`;
            return (
              <Card
                key={`faultTree-card-${index}`}
                index={index}
                name={faultTree.name}
                systemIri={faultTree?.system?.iri}
                onRedirect={() => navigate(routePath)}
                onOpenMenu={(e: any) => handleFaultTreeContextMenu(e, faultTree)}
                border={border}
              />
            );
          })}
        {systems &&
          modifiedSystemsList.map((system, index) => {
            const border = hoveredIndex === index ? borderHover : borderDefault;
            const routePath = ROUTES.SYSTEMS + `/${extractFragment(system.iri)}`;
            return (
              <Card
                key={`system-card-${index}`}
                index={index}
                name={system.name}
                systemIri={system.iri}
                onRedirect={() => navigate(routePath)}
                onOpenMenu={(e: any) => handleSystemContextMenu(e, system)}
                border={border}
              />
            );
          })}
      </Grid>
    </Box>
  );
};

export default FaultTreeAndSystemOverviewCardsList;
