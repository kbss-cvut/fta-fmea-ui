import {useEffect, useRef, useState} from "react";
import * as React from "react";
import useStyles from "@components/editor/canvas/EditorCanvas.styles";
import {FailureMode} from "@models/failureModeModel";
import {useSnackbar} from "@hooks/useSnackbar";
import JointEventShape from "@components/editor/shapes/JointEventShape";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import Portal from "@components/editor/Portal";
import {Menu, MenuItem} from "@material-ui/core";
import {FaultEvent, Event, GateType, Gate} from "@models/eventModel";
import {TreeNode} from "@models/treeNodeModel";
import * as _ from 'lodash';
import {findNodeByIri} from "@utils/treeUtils";
import {useLocalContext} from "@hooks/useLocalContext";
import {PngExportData} from "@components/editor/tools/PngExporter";

interface Props {
    failureMode: FailureMode,
    exportImage: (string) => void
}

const EditorCanvas = ({failureMode, exportImage}: Props) => {
    const classes = useStyles()
    const [showSnackbar] = useSnackbar();

    const containerRef = useRef(null)
    const windowToolRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()
    const [rootNode, setRootNode] = useState<TreeNode<Event>>(failureMode.manifestingNode)
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
        paper.on('element:contextmenu', (elementView) => {
                // @ts-ignore
                const rootNodeClone = _.cloneDeep(localContext.current.rootNode);

                const elementIri = elementView.model.get('custom/data').iri;
                const node = findNodeByIri(elementIri, rootNodeClone);

                // TODO testing event manipulation
                (node.event as FaultEvent).name = 'CHanged Name!!!';
                (node.event as Gate).gateType = GateType.PRIORITY_AND;

                setRootNode(rootNodeClone)

                // TODO show menu
                // setAnchorPos({
                //     mouseX: evt.pageX,
                //     mouseY: evt.pageY,
                // })
            }
        );

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

        joint.layout.DirectedGraph.layout(container, {
            dagre: dagre,
            graphlib: graphlib,
            rankDir: 'BT',
            setLinkVertices: false,
        });
    }

    // TODO refactor
    const initialAnchorPosition = {mouseX: null, mouseY: null,};
    const [anchorPos, setAnchorPos] = useState<{ mouseX: null | number; mouseY: null | number; }>(initialAnchorPosition)

    const eventMenu = (
        <Menu
            keepMounted
            open={anchorPos.mouseY !== null}
            onClose={() => setAnchorPos(initialAnchorPosition)}
            anchorReference="anchorPosition"
            anchorPosition={
                anchorPos.mouseY !== null && anchorPos.mouseX !== null ? {
                    top: anchorPos.mouseY,
                    left: anchorPos.mouseX
                } : undefined
            }
        >
            <MenuItem key="event-menu-edit">Edit</MenuItem>
            <MenuItem key="event-menu-new-gate">
                New Gate
            </MenuItem>
        </Menu>
    );

    return (
        <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}>
            <div id="editor-window-tool" className={classes.divWindowTool} ref={windowToolRef}/>
            {container && <JointEventShape addSelf={addSelf} treeNode={rootNode}/>}

            <Portal>
                {eventMenu}
            </Portal>
        </div>
    );
}

export default EditorCanvas;