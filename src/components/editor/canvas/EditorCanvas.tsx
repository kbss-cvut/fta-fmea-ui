import {useEffect, useRef, useState} from "react";
import * as React from "react";
import useStyles from "@components/editor/canvas/EditorCanvas.styles";
import FaultEventShape from "@components/editor/shapes/FaultEventShape";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import {TreeNode} from "@models/treeNodeModel";
import {useLocalContext} from "@hooks/useLocalContext";
import {PngExportData} from "@components/editor/tools/PngExporter";
import {V} from "jointjs";
import ShapeToolPane from "@components/editor/tools/ShapeToolPane";

interface Props {
    rootNode: TreeNode,
    sidebarSelectedNode: TreeNode,
    exportImage: (string) => void,
    onElementContextMenu: (element: any, evt: any) => void,
    onNodeUpdated: (node: TreeNode) => void,
}

const EditorCanvas = ({rootNode, sidebarSelectedNode, exportImage, onElementContextMenu, onNodeUpdated}: Props) => {
    const classes = useStyles()

    const containerRef = useRef(null)
    const windowToolRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()

    const MIN_SCALE = 0.5, MAX_SCALE = 2;

    const [dragStartPosition, setDragStartPosition] = useState<{ x: number, y: number } | null>(null)
    const localContext = useLocalContext({dragStartPosition})

    useEffect(() => {
        const graph = new joint.dia.Graph;
        const divContainer = document.getElementById("jointjs-container");
        const paper = new joint.dia.Paper({
            // @ts-ignore
            el: divContainer,
            model: graph,
            width: containerRef.current.clientWidth - windowToolRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            gridSize: 10,
            drawGrid: true,
            defaultConnectionPoint: { name: 'boundary', args: { extrapolate: true }},
            defaultConnector: { name: 'rounded' },
            defaultRouter: { name: 'orthogonal' },
            sorting: joint.dia.Paper.sorting.APPROX
        })

        // @ts-ignore
        paper.on('element:contextmenu', (elementView, evt) => {
                onElementContextMenu(elementView, evt)
            }
        );

        // TODO create button for export
        // @ts-ignore
        paper.on('element:pointerdblclick', () => {
            const svgPaper = document.querySelector('#jointjs-container > svg');
            // @ts-ignore
            const {width, height} = svgPaper.getBBox();
            const svgData = new XMLSerializer().serializeToString(svgPaper);
            const encodedData = btoa(unescape(encodeURIComponent(svgData)));
            exportImage({encodedData: encodedData, width: width, height: height} as PngExportData)
        });

        // Zoom in,out
        // @ts-ignore
        paper.on('cell:mousewheel', (cellView, evt, x, y, delta) => {
            handleCanvasMouseWheel(evt, x, y, delta, paper)
        })
        // @ts-ignore
        paper.on('blank:mousewheel', (evt, x, y, delta) => {
            handleCanvasMouseWheel(evt, x, y, delta, paper)
        })

        // Canvas dragging
        // @ts-ignore
        paper.on('blank:pointerdown', (evt, x, y) => {
            const scale = V(paper.viewport).scale();
            setDragStartPosition({x: x * scale.sx, y: y * scale.sy})
        });
        // @ts-ignore
        paper.on('cell:pointerup blank:pointerup', (cellView, x, y) => setDragStartPosition(null));
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
        graph.getElements().forEach((el)  => {
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


    return (
        <React.Fragment>
            <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}>
                {container && rootNode && <FaultEventShape addSelf={addSelf} treeNode={rootNode}/>}
            </div>
            <div className={classes.divWindowTool} ref={windowToolRef}>
                <ShapeToolPane data={sidebarSelectedNode} onNodeUpdated={onNodeUpdated}/>
            </div>
        </React.Fragment>
    );
}

export default EditorCanvas;