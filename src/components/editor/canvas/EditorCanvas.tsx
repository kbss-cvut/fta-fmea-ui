import {useEffect, useRef, useState} from "react";
import * as React from "react";
import useStyles from "@components/editor/canvas/EditorCanvas.styles";
import JointEventShape from "@components/editor/shapes/JointEventShape";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import {FaultEvent, Event} from "@models/eventModel";
import {TreeNode} from "@models/treeNodeModel";
import * as _ from 'lodash';
import {useLocalContext} from "@hooks/useLocalContext";
import {PngExportData} from "@components/editor/tools/PngExporter";

interface Props {
    rootNode: TreeNode<FaultEvent>,
    exportImage: (string) => void,
    onElementContextMenu: (element: any, evt: any) => void,
}

const EditorCanvas = ({rootNode, exportImage, onElementContextMenu}: Props) => {
    const classes = useStyles()

    const MIN_SCALE = 0.5, MAX_SCALE = 2

    const containerRef = useRef(null)
    const windowToolRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()

    useEffect(() => {
        const graph = new joint.dia.Graph;
        const paper = new joint.dia.Paper({
            // @ts-ignore
            el: document.getElementById("jointjs-container"),
            model: graph,
            width: containerRef.current.clientWidth - windowToolRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            gridSize: 10,
            drawGrid: true,
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

        // @ts-ignore
        paper.on('cell:mousewheel', (cellView, evt, x, y, delta) => {
            handleCanvasMouseWheel(evt, x, y, delta, paper)
        })
        // @ts-ignore
        paper.on('blank:mousewheel', (evt, x, y, delta) => {
            handleCanvasMouseWheel(evt, x, y, delta, paper)
        })

        setContainer(graph)
    }, []);

    const addSelf = (shape: any) => {
        shape.addTo(container)
        autoLayout()
    }

    const autoLayout = () => {
        joint.layout.DirectedGraph.layout(container, {
            dagre: dagre,
            graphlib: graphlib,
            rankDir: 'BT',
            setLinkVertices: false,
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
        <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}>
            <div id="editor-window-tool" className={classes.divWindowTool} ref={windowToolRef}/>
            {container && <JointEventShape addSelf={addSelf} treeNode={rootNode}/>}
        </div>
    );
}

export default EditorCanvas;