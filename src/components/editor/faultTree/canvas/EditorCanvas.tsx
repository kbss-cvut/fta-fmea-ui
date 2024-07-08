import { useEffect, useRef, useState } from "react";
import * as React from "react";
import useStyles from "../../EditorCanvas.styles";
import * as joint from "jointjs";
import * as dagre from "dagre";
import * as graphlib from "graphlib";
import SidebarMenu from "../menu/SidebarMenu";
import { FaultEvent } from "@models/eventModel";
import FaultEventMenu from "@components/editor/faultTree/menu/faultEvent/FaultEventMenu";
import { CurrentFaultTreeTableProvider } from "@hooks/useCurrentFaultTreeTable";
import SidebarMenuHeader from "@components/editor/faultTree/menu/SidebarMenuHeader";
import svgPanZoom from "svg-pan-zoom";
import { SVG_PAN_ZOOM_OPTIONS } from "@utils/constants";
import { saveSvgAsPng } from "save-svg-as-png";
import renderTree from "@components/editor/faultTree/shapes/RenderTree";
import { JOINTJS_NODE_MODEL } from "@components/editor/faultTree/shapes/constants";
import { FaultEventScenario } from "@models/faultEventScenario";
import { findNodeByIri } from "@utils/treeUtils";
import FaultEventScenariosTable from "../menu/FaultEventScenariosTable";
import { Box, TextField, Typography, IconButton, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { useCurrentFaultTree } from "@hooks/useCurrentFaultTree";
import { useFaultTrees } from "@hooks/useFaultTrees";
import { calculateCutSets } from "@services/faultTreeService";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { useNavigate } from "react-router-dom";

enum MOVE_NODE {
  DRAGGING = 0,
  RELEASING = 1,
}

interface Props {
  treeName: string;
  rootEvent: FaultEvent;
  sidebarSelectedEvent: FaultEvent;
  onElementContextMenu: (element: any, evt: any) => void;
  onElementPointerClick: (element: any, evt: any) => void;
  onBlankPointerClick: () => void;
  onEventUpdated: (faultEvent: FaultEvent) => void;
  onConvertToTable: () => void;
  onCutSetAnalysis: () => void;
  onNodeMove: (element: any, evt: any) => void;
  refreshTree: () => void;
  setHighlightedElement: (element: any) => void;
  faultEventScenarios: FaultEventScenario[];
  showPath: boolean;
  showTable: boolean;
  possibleFaultEventScenarios: FaultEventScenario[];
  onScenarioSelect: (scenario: FaultEventScenario) => void;
}

const EditorCanvas = ({
  treeName,
  rootEvent,
  sidebarSelectedEvent,
  onElementContextMenu,
  onElementPointerClick,
  onBlankPointerClick,
  onEventUpdated,
  onConvertToTable,
  onCutSetAnalysis,
  onNodeMove,
  refreshTree,
  setHighlightedElement,
  faultEventScenarios,
  showPath,
  showTable,
  possibleFaultEventScenarios,
  onScenarioSelect,
}: Props) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const history = useNavigate();
  const { t } = useTranslation();

  const containerRef = useRef(null);

  const [container, setContainer] = useState<joint.dia.Graph>();
  const [jointPaper, setJointPaper] = useState<joint.dia.Paper>();

  const [svgZoom, setSvgZoom] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [targets, setTargets] = useState<undefined | string[]>();
  const [rendering, setRendering] = useState<boolean>(false);
  const [faultTree] = useCurrentFaultTree();
  const initialMinOperationalHours = faultTree?.operationalDataFilter?.minOperationalHours || 0;
  const [, , updateTree] = useFaultTrees();
  const [updatedMinOperationalHours, setUpdatedMinOperationalHours] = useState(initialMinOperationalHours);
  const [inputColor, setInputColor] = useState("");
  const [showSnackbar] = useSnackbar();

  let dragStartPosition = null;

  useEffect(() => {
    const targetsIri = [];

    faultEventScenarios.forEach((scenario) => {
      if (Array.isArray(scenario?.scenarioParts)) {
        scenario.scenarioParts.forEach((scenarioPart) => targetsIri.push(scenarioPart.iri));
      } else {
        targetsIri.push(scenario?.scenarioParts?.iri);
      }
    });

    setTargets(targetsIri);
  }, [faultEventScenarios]);

  useEffect(() => {
    const canvasWidth = containerRef.current.clientWidth;
    const canvasHeight = containerRef.current.clientHeight;

    const graph = new joint.dia.Graph();
    const divContainer = document.getElementById("jointjs-container");
    const paper = new joint.dia.Paper({
      el: divContainer,
      model: graph,
      width: canvasWidth,
      height: canvasHeight,
      gridSize: 10,
      drawGrid: true,
      drawGridSize: 50,
      restrictTranslate: true,
      defaultConnectionPoint: { name: "boundary", args: { extrapolate: true } },
      defaultConnector: { name: "rounded" },
      defaultRouter: { name: "orthogonal" },
    });

    const diagramZoom = svgPanZoom("#jointjs-container > svg", {
      ...SVG_PAN_ZOOM_OPTIONS,
      onZoom: setCurrentZoom,
      dblClickZoomEnabled: false,
    });
    setSvgZoom(diagramZoom);

    paper.on({
      "element:contextmenu": (elementView: joint.dia.ElementView, evt: joint.dia.Event) => {
        onElementContextMenu(elementView, evt);
      },
      "element:pointerdown": (elementView: joint.dia.ElementView, evt: joint.dia.Event) => {
        onElementPointerClick(elementView, evt);
      },
      "element:pointermove": (elementView: joint.dia.ElementView, evt: joint.dia.Event, x: number, y: number) => {
        handleNodeMove(MOVE_NODE.DRAGGING, elementView, evt, x, y);
      },
      "element:pointerup": (elementView: joint.dia.ElementView, evt: joint.dia.Event, x: number, y: number) => {
        handleNodeMove(MOVE_NODE.RELEASING, elementView, evt, x, y);
      },
      "element:pointerdblclick": (elementView: joint.dia.ElementView) => {
        if (elementView?.model.attributes[JOINTJS_NODE_MODEL.redirectTo]) {
          const redirectTo = elementView?.model.attributes[JOINTJS_NODE_MODEL.redirectTo];
          history(`/fta/${redirectTo}`);
          setTimeout(() => {
            diagramZoom.reset();
          }, 100);
        }
      },
      "blank:pointerclick": () => onBlankPointerClick(),
      "blank:pointerdown": () => diagramZoom.enablePan(),
      "blank:pointerup": () => diagramZoom.disablePan(),
    });

    setContainer(graph);
    setJointPaper(paper);
  }, []);

  const handleNodeMove = (
    move: MOVE_NODE,
    elementView: joint.dia.ElementView,
    evt: joint.dia.Event,
    x: number,
    y: number,
  ) => {
    if (!dragStartPosition && move === MOVE_NODE.DRAGGING) dragStartPosition = [x, y];
    else if (
      dragStartPosition &&
      (dragStartPosition[0] != x || dragStartPosition[1] != y) &&
      move === MOVE_NODE.RELEASING
    ) {
      dragStartPosition = null;
      onNodeMove(elementView, evt);
    }
  };

  useEffect(() => {
    if (isExportingImage) {
      const svgPaper = document.querySelector("#jointjs-container > svg");
      const padding = 20;
      const bbox = container.getBBox().inflate(padding);

      saveSvgAsPng(svgPaper, treeName + ".png", {
        width: bbox.width * currentZoom + padding,
        height: bbox.height * currentZoom + padding,
      });

      setIsExportingImage(false);
    }
  }, [isExportingImage]);

  const addSelf = (shape: any) => {
    shape.addTo(container);
    layout(container);
  };

  const layout = (graph) => {
    const autoLayoutElements = [];
    const manualLayoutElements = [];
    graph.getElements().forEach((el) => {
      const faultEventIri = el.get(JOINTJS_NODE_MODEL.faultEventIri);
      if (faultEventIri && faultEventIri === sidebarSelectedEvent?.iri) {
        const elementView = el.findView(jointPaper);
        setHighlightedElement(elementView);
      }

      if (el.get("type") === "fta.ConditioningEvent") {
        manualLayoutElements.push(el);
      } else if (!el.get(JOINTJS_NODE_MODEL.hasPersistentPosition)) {
        autoLayoutElements.push(el);
      }
    });
    // Automatic Layout
    joint.layout.DirectedGraph.layout(graph.getSubgraph(autoLayoutElements), {
      dagre: dagre,
      graphlib: graphlib,
      setVertices: true,
      marginX: 20,
      marginY: 20,
    });
    // Manual Layout
    manualLayoutElements.forEach((el) => {
      const neighbor = graph.getNeighbors(el, { inbound: true })[0];
      if (!neighbor) return;
      const neighborPosition = neighbor.getBBox().bottomRight();
      el.position(neighborPosition.x + 20, neighborPosition.y - el.size().height / 2 - 20);
    });
  };

  const handleDiagramExport = () => {
    svgZoom.reset();
    setIsExportingImage(true);
  };

  useEffect(() => {
    const renderAndLayout = async () => {
      if (container && rootEvent) {
        setRendering(true);
        container.removeCells(container.getCells());

        const listOfPaths = [];

        if (targets.length > 0 && showPath) {
          targets.forEach((target) => listOfPaths.push(findNodeByIri(rootEvent, target)));
        }

        await renderTree(container, rootEvent, null, listOfPaths, faultTree?.status);
        layout(container);
        setRendering(false);
      }
    };

    renderAndLayout();
  }, [container, rootEvent, faultEventScenarios]);

  useEffect(() => {
    setUpdatedMinOperationalHours((prevState) => {
      const newMinOperationalHours = faultTree?.operationalDataFilter?.minOperationalHours;

      if (prevState !== newMinOperationalHours) {
        return newMinOperationalHours;
      }
      return prevState;
    });
  }, [faultTree]);

  const handleMinOperationalHoursChange = (event) => {
    const newValue = event.target.value;
    setUpdatedMinOperationalHours(newValue);
    if (newValue !== faultTree?.operationalDataFilter?.minOperationalHours) {
      setInputColor(theme.notSynchronized.color);
    } else {
      setInputColor(theme.synchronized.color);
    }
  };

  const handleReset = () => {
    setUpdatedMinOperationalHours(initialMinOperationalHours);
    setInputColor(theme.synchronized.color);
  };

  const handleSetNewDefaultOperationalHours = () => {
    const newOperationalDataFilter = Object.assign({}, faultTree.operationalDataFilter);
    newOperationalDataFilter.minOperationalHours =
      updatedMinOperationalHours || faultTree.operationalDataFilter.minOperationalHours;
    calculateCutSets(faultTree.iri, newOperationalDataFilter)
      .then((d) => {
        refreshTree();
      })
      .catch((reason) => {
        showSnackbar(reason, SnackbarType.ERROR);
      });

    setInputColor(theme.synchronized.color);
  };

  return (
    <div className={classes.root}>
      <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}></div>
      <SidebarMenu className={classes.sidebar}>
        <CurrentFaultTreeTableProvider>
          <SidebarMenuHeader
            onExportDiagram={handleDiagramExport}
            onConvertToTable={onConvertToTable}
            onRestoreLayout={() => layout(container)}
            onCutSetAnalysis={onCutSetAnalysis}
            rendering={rendering}
          />
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
            <IconButton aria-label="restore layout" size="large" onClick={handleReset}>
              <RestartAltIcon />
            </IconButton>
            <IconButton aria-label="restore layout" size="large" onClick={handleSetNewDefaultOperationalHours}>
              <PlayArrow />
            </IconButton>
          </Box>
        </CurrentFaultTreeTableProvider>
        {!showTable && (
          <FaultEventMenu
            shapeToolData={sidebarSelectedEvent}
            onEventUpdated={onEventUpdated}
            refreshTree={refreshTree}
            rootIri={rootEvent?.iri}
          />
        )}
        {showTable && (
          <FaultEventScenariosTable scenarios={possibleFaultEventScenarios} onScenarioSelect={onScenarioSelect} />
        )}
      </SidebarMenu>
    </div>
  );
};

export default EditorCanvas;
