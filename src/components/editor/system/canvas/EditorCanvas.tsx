import { useEffect, useRef, useState } from "react";
import * as React from "react";
import useStyles from "../../EditorCanvas.styles";
import * as joint from "jointjs";
import * as dagre from "dagre";
import * as graphlib from "graphlib";
import { System } from "@models/systemModel";
import { Component } from "@models/componentModel";
import { flatten, cloneDeep } from "lodash";
import ComponentShape from "@components/editor/system/shapes/ComponentShape";
import DiagramOptions from "@components/editor/menu/DiagramOptions";
import SidebarMenu from "@components/editor/faultTree/menu/SidebarMenu";
import ComponentSidebarMenu from "@components/editor/system/menu/component/ComponentSidebarMenu";
import { SystemLink } from "@components/editor/system/shapes/shapesDefinitions";
import svgPanZoom from "svg-pan-zoom";
import { SVG_PAN_ZOOM_OPTIONS } from "@utils/constants";
import { saveSvgAsPng } from "save-svg-as-png";
import { Box, IconButton, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import { updateFilter } from "@services/systemService";
import { useSystems } from "@hooks/useSystems";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";

interface Props {
  system: System;
  sidebarSelectedComponent: Component;
  onBlankContextMenu: (evt: any) => void;
  onElementContextMenu: (element: any, evt: any) => void;
  onElementPointerClick: (element: any, evt: any) => void;
  onBlankPointerClick: () => void;
  onComponentUpdated: (component: Component) => void;
  setHighlightedElement: (element: any) => void;
}

const EditorCanvas = ({
  system,
  sidebarSelectedComponent,
  onBlankContextMenu,
  onElementContextMenu,
  onElementPointerClick,
  onBlankPointerClick,
  onComponentUpdated,
  setHighlightedElement,
}: Props) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const [showSnackbar] = useSnackbar();
  const { t } = useTranslation();

  const containerRef = useRef(null);

  const [container, setContainer] = useState<joint.dia.Graph>();
  const [jointPaper, setJointPaper] = useState<joint.dia.Paper>();

  const [svgZoom, setSvgZoom] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [selectedSystem, setSelectedSystem] = useSelectedSystemSummaries();
  const globalOperationalHours = selectedSystem?.globalOperationalDataFilter?.minOperationalHours || 0;
  const getSystemOperationalHours = () =>
    selectedSystem?.operationalDataFilter?.minOperationalHours || globalOperationalHours;
  const [updatedMinOperationalHours, setUpdatedMinOperationalHours] = useState(getSystemOperationalHours());
  const [inputColor, setInputColor] = useState("");

  useEffect(() => {
    const canvasWidth = containerRef.current.clientWidth;
    const canvasHeight = containerRef.current.clientHeight;

    const graph = new joint.dia.Graph();
    const divContainer = document.getElementById("jointjs-system-container");
    const paper = new joint.dia.Paper({
      el: divContainer,
      model: graph,
      width: canvasWidth,
      height: canvasHeight,
      gridSize: 10,
      drawGrid: true,
      restrictTranslate: true,
      defaultConnector: { name: "normal" },
      defaultRouter: { name: "normal" },
    });

    const diagramZoom = svgPanZoom("#jointjs-system-container > svg", {
      ...SVG_PAN_ZOOM_OPTIONS,
      onZoom: setCurrentZoom,
    });
    setSvgZoom(diagramZoom);

    paper.on({
      "blank:contextmenu": (evt) => {
        onBlankContextMenu(evt);
      },
      "element:contextmenu": (elementView, evt) => {
        onElementContextMenu(elementView, evt);
      },
      "element:pointerclick": (elementView, evt) => {
        onElementPointerClick(elementView, evt);
      },
      "blank:pointerclick": () => onBlankPointerClick(),
      "blank:pointerdown": () => diagramZoom.enablePan(),
      "blank:pointerup": () => diagramZoom.disablePan(),
    });

    setContainer(graph);
    setJointPaper(paper);
  }, []);

  useEffect(() => {
    if (isExportingImage) {
      const svgPaper = document.querySelector("#jointjs-system-container > svg");
      const padding = 20;
      const bbox = container.getBBox().inflate(padding);

      saveSvgAsPng(svgPaper, system?.name + ".png", {
        width: bbox.width * currentZoom + padding,
        height: bbox.height * currentZoom + padding,
      });

      setIsExportingImage(false);
    }
  }, [isExportingImage]);

  const [componentShapesMap, setComponentShapesMap] = useState<Map<string, any>>(new Map());
  const [componentLinksMap, setComponentLinksMap] = useState<Map<string, string>>(new Map());

  const addSelf = (componentIri: string, shape: any) => {
    shape.addTo(container);
    layout(container);

    setComponentShapesMap((prevMap) => {
      const mapClone = cloneDeep(prevMap);
      mapClone.set(componentIri, shape);
      return mapClone;
    });
  };

  const layout = (graph) => {
    graph.getElements().forEach((el) => {
      const componentIri = el.get("custom/componentIri");
      if (componentIri && componentIri === sidebarSelectedComponent?.iri) {
        const elementView = el.findView(jointPaper);
        setHighlightedElement(elementView);
      }
    });

    joint.layout.DirectedGraph.layout(graph, {
      rankDir: "BT",
      dagre: dagre,
      graphlib: graphlib,
      setVertices: true,
      marginX: 20,
      marginY: 20,
    });
  };

  const handleDiagramExport = () => {
    svgZoom.reset();
    setIsExportingImage(true);
  };

  const addLink = (componentIri: string, linkedComponentIri: string) => {
    setComponentLinksMap((prevMap) => {
      const mapClone = cloneDeep(prevMap);
      mapClone.set(componentIri, linkedComponentIri);
      return mapClone;
    });
  };

  const removeSelf = (componentIri: string, shape: any) => {
    setComponentLinksMap((prevMap) => {
      const mapClone = cloneDeep(prevMap);
      mapClone.delete(componentIri);
      return mapClone;
    });
    shape.remove();
  };

  useEffect(() => {
    drawLinks(componentShapesMap, componentLinksMap);
  }, [componentShapesMap, componentLinksMap]);

  const drawLinks = (componentShapesMap, componentLinksMap) => {
    componentLinksMap.forEach((sourceIri, targetIri) => {
      const sourceShape = componentShapesMap.get(sourceIri);
      const targetShape = componentShapesMap.get(targetIri);
      if (sourceShape && targetShape) {
        const link = new SystemLink();

        link.source(targetShape);
        link.target(sourceShape, {
          connectionPoint: {
            name: "anchor",
          },
          anchor: { name: "bottom" },
        });
        link.addTo(container);
      }
    });
    if (container) {
      layout(container);
    }
  };

  const handleMinOperationalHoursChange = (event) => {
    const newValue = event.target.value;
    setUpdatedMinOperationalHours(newValue);
    if (newValue !== getSystemOperationalHours()) {
      setInputColor(theme.notSynchronized.color);
    } else {
      setInputColor(theme.synchronized.color);
    }
  };

  const handleSetNewDefaultOperationalHours = (resetGlobalValue = false) => {
    const newValue = resetGlobalValue ? globalOperationalHours : updatedMinOperationalHours;
    if (newValue != updatedMinOperationalHours) setUpdatedMinOperationalHours(newValue);

    if (newValue == getSystemOperationalHours()) {
      setInputColor(theme.synchronized.color);
      return;
    }

    updateFilter(system?.iri, {
      ...selectedSystem.operationalDataFilter,
      minOperationalHours: newValue,
    })
      .then(() => {
        setSelectedSystem({
          ...selectedSystem,
          operationalDataFilter: {
            ...selectedSystem.operationalDataFilter,
            minOperationalHours: newValue,
          },
        });
        setInputColor(theme.synchronized.color);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  return (
    <div className={classes.root}>
      <div id="jointjs-system-container" className={classes.konvaContainer} ref={containerRef}>
        {container &&
          system &&
          flatten([system.components]).map((value) => (
            <ComponentShape
              key={value.iri}
              component={value}
              addSelf={addSelf}
              addLink={addLink}
              removeSelf={removeSelf}
            />
          ))}
      </div>
      <SidebarMenu className={classes.sidebar}>
        <DiagramOptions onRestoreLayout={() => layout(container)} onExportDiagram={handleDiagramExport} />
        <Box padding={2} display="flex" alignItems="center">
          <Typography noWrap sx={{ flex: 3 }}>
            {t("diagramSidePanel.minimumOperationalHours")}
          </Typography>
          <TextField
            type="number"
            size="small"
            sx={{ flex: 2, input: { color: inputColor } }}
            value={updatedMinOperationalHours}
            onChange={handleMinOperationalHoursChange}
          />
          <IconButton
            aria-label="restore layout"
            size="large"
            onClick={() => handleSetNewDefaultOperationalHours(true)}
          >
            <RestartAltIcon />
          </IconButton>
          <IconButton
            aria-label="restore layout"
            size="large"
            onClick={() => handleSetNewDefaultOperationalHours(false)}
          >
            <CheckIcon />
          </IconButton>
        </Box>
        {system && (
          <ComponentSidebarMenu
            component={sidebarSelectedComponent}
            onComponentUpdated={onComponentUpdated}
            systemComponents={system?.components}
          />
        )}
      </SidebarMenu>
    </div>
  );
};

export default EditorCanvas;
