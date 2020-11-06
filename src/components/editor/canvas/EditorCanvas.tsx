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
    onElementContextMenu: (element: any, evt: any, node: TreeNode<Event>) => void,
}

const EditorCanvas = ({rootNode, exportImage, onElementContextMenu}: Props) => {
    const classes = useStyles()

    const containerRef = useRef(null)
    const windowToolRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()
    const localContext = useLocalContext({rootNode})

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
                const rootNodeClone = _.cloneDeep(localContext.current.rootNode);
                onElementContextMenu(elementView, evt, rootNodeClone)
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

    return (
        <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}>
            <div id="editor-window-tool" className={classes.divWindowTool} ref={windowToolRef}/>
            {container && <JointEventShape addSelf={addSelf} treeNode={rootNode}/>}
        </div>
    );
}

export default EditorCanvas;