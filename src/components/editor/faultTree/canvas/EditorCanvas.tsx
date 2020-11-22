import {useEffect, useRef, useState} from "react";
import * as React from "react";
import useStyles from "../../EditorCanvas.styles";
import FaultEventShape from "../shapes/FaultEventShape";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import {useLocalContext} from "@hooks/useLocalContext";
import {PngExportData} from "../../export/PngExporter";
import {V} from "jointjs";
import SidebarMenu from "../tools/SidebarMenu";
import {FTABoundary} from "../shapes/shapesDefinitions";
import {FaultEvent} from "@models/eventModel";
import {handleCanvasMouseWheel} from "@utils/canvasZoom";

interface Props {
    rootEvent: FaultEvent,
    sidebarSelectedEvent: FaultEvent,
    exportImage: (string) => void,
    onElementContextMenu: (element: any, evt: any) => void,
    onEventUpdated: (faultEvent: FaultEvent) => void,
}

const EditorCanvas = ({rootEvent, sidebarSelectedEvent, exportImage, onElementContextMenu, onEventUpdated}: Props) => {
    const classes = useStyles()

    const containerRef = useRef(null)
    const windowToolRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()
    const [canvasDimensions, setCanvasDimensions] = useState([0,0]);

    const [dragStartPosition, setDragStartPosition] = useState<{ x: number, y: number } | null>(null)
    const localContext = useLocalContext({dragStartPosition})

    useEffect(() => {
        const canvasWidth = containerRef.current.clientWidth;
        const canvasHeight = containerRef.current.clientHeight;
        setCanvasDimensions([canvasWidth, canvasHeight]);

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
            'element:mouseleave': function(elementView) {
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
        const [width, height] = canvasDimensions;
        const svgData = new XMLSerializer().serializeToString(svgPaper);
        const encodedData = btoa(unescape(encodeURIComponent(svgData)));
        exportImage({encodedData: encodedData, width: width, height: height} as PngExportData)
    }

    return (
        <div className={classes.root}>
            <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}>
                {container && rootEvent && <FaultEventShape addSelf={addSelf} treeEvent={rootEvent}/>}
            </div>
            <div className={classes.divWindowTool} ref={windowToolRef}>
                <SidebarMenu
                    onRestoreLayout={() => layout(container)}
                    onExportDiagram={handleDiagramExport}
                    shapeToolData={sidebarSelectedEvent}
                    onEventUpdated={onEventUpdated}/>
            </div>
        </div>
    );
}

export default EditorCanvas;