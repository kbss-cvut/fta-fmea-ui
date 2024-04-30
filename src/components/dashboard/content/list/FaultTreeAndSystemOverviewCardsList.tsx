import React, { FC, useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useStyles from "./FaultTreeOverviewCardsList.styles";
import { useTranslation } from "react-i18next";
import { FaultTree } from "@models/faultTreeModel";
import { ROUTES } from "@utils/constants";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { useNavigate } from "react-router-dom";
import { System } from "@models/systemModel";

const borderDefault = "1px solid #E0E0E0";
const borderHover = "1px solid #60A3D9";

interface FaultTreeOverviewCardsListProps {
  faultTrees?: FaultTree[];
  systems?: System[];
  handleFaultTreeContextMenu?: (evt: any, faultTree: FaultTree) => void;
  handleSystemContextMenu?: (evt: any, system: System) => void;
}

interface CardProps {
  name: string;
  onRedirect: (e: any) => void;
  onOpenMenu: (e: any) => void;
  border: string;
  index: number;
}

const FaultTreeAndSystemOverviewCardsList: FC<FaultTreeOverviewCardsListProps> = ({
  faultTrees,
  systems,
  handleFaultTreeContextMenu,
  handleSystemContextMenu,
}) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const Card: FC<CardProps> = ({ name, onRedirect, onOpenMenu, border, index }) => {
    return (
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <Box
          className={classes.cardContainer}
          style={{ border: border }}
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
                onRedirect={() => navigate(routePath)}
                onOpenMenu={(e: any) => handleFaultTreeContextMenu(e, faultTree)}
                border={border}
              />
            );
          })}
        {systems &&
          systems.map((system, index) => {
            const border = hoveredIndex === index ? borderHover : borderDefault;
            const routePath = ROUTES.SYSTEMS + `/${extractFragment(system.iri)}`;
            return (
              <Card
                key={`system-card-${index}`}
                index={index}
                name={system.name}
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
