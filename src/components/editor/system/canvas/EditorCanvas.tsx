import {useEffect, useRef, useState} from "react";
import * as React from "react";
import useStyles from "../../EditorCanvas.styles";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import {useLocalContext} from "@hooks/useLocalContext";
import {V} from "jointjs";
import {System} from "@models/systemModel";
import {Component} from "@models/componentModel";
import {PngExportData} from "../../faultTree/tools/PngExporter";
import {flatten} from "lodash";
import ComponentShape from "@components/editor/system/shapes/ComponentShape";

interface Props {
    system: System,
    sidebarSelectedComponent: Component,
    exportImage: (string) => void,
    onBlankContextMenu: (evt: any) => void,
    onElementContextMenu: (element: any, evt: any) => void,
    onComponentUpdated: (component: Component) => void,
}

const EditorCanvas = ({system, sidebarSelectedComponent, exportImage, onBlankContextMenu, onElementContextMenu, onComponentUpdated}: Props) => {
    const classes = useStyles()

    const containerRef = useRef(null)
    const windowToolRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()
    const [canvasDimensions, setCanvasDimensions] = useState([0, 0]);

    const MIN_SCALE = 0.5, MAX_SCALE = 2;

    const [dragStartPosition, setDragStartPosition] = useState<{ x: number, y: number } | null>(null)
    const localContext = useLocalContext({dragStartPosition})

    useEffect(() => {
        const canvasWidth = containerRef.current.clientWidth;
        const canvasHeight = containerRef.current.clientHeight;
        setCanvasDimensions([canvasWidth, canvasHeight]);

        const graph = new joint.dia.Graph;
        const divContainer = document.getElementById("jointjs-system-container");
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
            'blank:contextmenu': (evt) => {
                onBlankContextMenu(evt);
            },
            'element:contextmenu': (elementView, evt) => {
                console.log('elementContextMenu')
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
        joint.layout.DirectedGraph.layout(graph.getElements(), {
            dagre: dagre,
            graphlib: graphlib,
            setVertices: true,
            marginX: 20,
            marginY: 20
        });
    }

    const handleCanvasMouseWheel = (e, x, y, delta, paper) => {
        e.preventDefault();

        const oldScale = paper.scale().sx;
        const newScale = oldScale + delta * .1;

        scaleToPoint(newScale, x, y, paper);
    };

    const scaleToPoint = (nextScale, x, y, paper) => {
        if (nextScale >= MIN_SCALE && nextScale <= MAX_SCALE) {
            const currentScale = paper.scale().sx;

            const beta = currentScale / nextScale;

            const ax = x - (x * beta);
            const ay = y - (y * beta);

            const translate = paper.translate();

            const nextTx = translate.tx - ax * nextScale;
            const nextTy = translate.ty - ay * nextScale;

            paper.translate(nextTx, nextTy);

            const ctm = paper.matrix();

            ctm.a = nextScale;
            ctm.d = nextScale;

            paper.matrix(ctm);
        }
    };

    const handleDiagramExport = () => {
        const svgPaper = document.querySelector('#jointjs-system-container > svg');
        const [width, height] = canvasDimensions;
        const svgData = new XMLSerializer().serializeToString(svgPaper);
        const encodedData = btoa(unescape(encodeURIComponent(svgData)));
        exportImage({encodedData: encodedData, width: width, height: height} as PngExportData)
    }

    // TODO extract some common functionality

    return (
        <div className={classes.root}>
            <div id="jointjs-system-container" className={classes.konvaContainer} ref={containerRef}>
                {container && system &&
                flatten([system.components])
                    .map(value => <ComponentShape component={value} addSelf={addSelf} key={value.iri}/>)
                }
                {/*{container && system && <FaultEventShape addSelf={addSelf} treeEvent={rootEvent}/>}*/}
            </div>
            <div className={classes.divWindowTool} ref={windowToolRef}>
                {/*<SidebarMenu*/}
                {/*    onRestoreLayout={() => layout(container)}*/}
                {/*    onExportDiagram={handleDiagramExport}*/}
                {/*    shapeToolData={sidebarSelectedComponent}*/}
                {/*    onEventUpdated={onComponentUpdated}/>*/}
            </div>
        </div>
    );
}

export default EditorCanvas;