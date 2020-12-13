import {useEffect, useRef, useState} from "react";
import * as React from "react";
import useStyles from "../../EditorCanvas.styles";
import FaultEventShape from "../shapes/FaultEventShape";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import {useLocalContext} from "@hooks/useLocalContext";
import {V} from "jointjs";
import SidebarMenu from "../menu/SidebarMenu";
import {FTABoundary} from "../shapes/shapesDefinitions";
import {FaultEvent} from "@models/eventModel";
import {handleCanvasMouseWheel} from "@utils/canvasZoom";
import FaultEventMenu from "@components/editor/faultTree/menu/faultEvent/FaultEventMenu";
import {CurrentFaultTreeTableProvider} from "@hooks/useCurrentFaultTreeTable";
import SidebarMenuHeader from "@components/editor/faultTree/menu/SidebarMenuHeader";
import * as svgService from "@services/svgService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

interface Props {
    treeName: string,
    rootEvent: FaultEvent,
    sidebarSelectedEvent: FaultEvent,
    onElementContextMenu: (element: any, evt: any) => void,
    onEventUpdated: (faultEvent: FaultEvent) => void,
    onConvertToTable: () => void,
    refreshTree: () => void,
}

const EditorCanvas = ({treeName, rootEvent, sidebarSelectedEvent, onElementContextMenu, onEventUpdated, onConvertToTable, refreshTree}: Props) => {
    const classes = useStyles()
    const [showSnackbar] = useSnackbar();

    const containerRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()

    const [dragStartPosition, setDragStartPosition] = useState<{ x: number, y: number } | null>(null)
    const localContext = useLocalContext({dragStartPosition})

    useEffect(() => {
        const canvasWidth = containerRef.current.clientWidth;
        const canvasHeight = containerRef.current.clientHeight;

        const graph = new joint.dia.Graph;
        const divContainer = document.getElementById("jointjs-container");
        const paper = new joint.dia.Paper({
            // @ts-ignore
            el: divContainer,
            model: graph,
            width: canvasWidth,
            height: canvasHeight,
            gridSize: 10,
            drawGrid: true,
            //async: true,
            defaultConnectionPoint: {name: 'boundary', args: {extrapolate: true}},
            defaultConnector: {name: 'rounded'},
            defaultRouter: {name: 'orthogonal'},
        })

        // @ts-ignore
        paper.on({
            'element:contextmenu': (elementView, evt) => {
                onElementContextMenu(elementView, evt)
            },
            // Zoom in,out
            'cell:mousewheel': (cellView, evt, x, y, delta) => {
                handleCanvasMouseWheel(evt, x, y, delta, paper)
            },
            'blank:mousewheel': (evt, x, y, delta) => {
                handleCanvasMouseWheel(evt, x, y, delta, paper)
            },
            // Canvas dragging
            'blank:pointerdown': (evt, x, y) => {
                const scale = V(paper.viewport).scale();
                setDragStartPosition({x: x * scale.sx, y: y * scale.sy})
            },
            'cell:pointerup blank:pointerup': () => setDragStartPosition(null),
            'element:mouseenter': (elementView) => {
                const tools = new joint.dia.ToolsView({
                    tools: [FTABoundary.factory()]
                });
                elementView.addTools(tools);
            },
            'element:mouseleave': function (elementView) {
                elementView.removeTools();
            },
        })

        divContainer.addEventListener('mousemove', e => {
            // @ts-ignore
            if (localContext.dragStartPosition) {
                // @ts-ignore
                paper.translate(e.offsetX - localContext.dragStartPosition.x, e.offsetY - localContext.dragStartPosition.y);
            }
        })

        setContainer(graph)
    }, []);

    const addSelf = (shape: any) => {
        shape.addTo(container)
        layout(container)
    }

    const layout = (graph) => {
        const autoLayoutElements = [];
        const manualLayoutElements = [];
        graph.getElements().forEach((el) => {
            if (el.get('type') === 'fta.ConditioningEvent') {
                manualLayoutElements.push(el);
            } else {
                autoLayoutElements.push(el);
            }
        });
        // Automatic Layout
        joint.layout.DirectedGraph.layout(graph.getSubgraph(autoLayoutElements), {
            dagre: dagre,
            graphlib: graphlib,
            setVertices: true,
            marginX: 20,
            marginY: 20
        });
        // Manual Layout
        manualLayoutElements.forEach((el) => {
            const neighbor = graph.getNeighbors(el, {inbound: true})[0];
            if (!neighbor) return;
            const neighborPosition = neighbor.getBBox().bottomRight();
            el.position(neighborPosition.x + 20, neighborPosition.y - el.size().height / 2 - 20);
        });
    }

    const handleDiagramExport = () => {
        const svgPaper = document.querySelector('#jointjs-container > svg');

        const svgString = new XMLSerializer().serializeToString(svgPaper);
        svgService.exportPng(svgString, treeName)
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR));
    }

    return (
        <div className={classes.root}>
            <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}>
                {container && rootEvent && <FaultEventShape addSelf={addSelf} treeEvent={rootEvent}/>}
            </div>
            <SidebarMenu className={classes.sidebar}>
                <CurrentFaultTreeTableProvider>
                    <SidebarMenuHeader onExportDiagram={handleDiagramExport}
                                       onConvertToTable={onConvertToTable} onRestoreLayout={() => layout(container)}/>
                </CurrentFaultTreeTableProvider>
                <FaultEventMenu shapeToolData={sidebarSelectedEvent} onEventUpdated={onEventUpdated}
                                refreshTree={refreshTree}/>
            </SidebarMenu>
        </div>
    );
}

export default EditorCanvas;