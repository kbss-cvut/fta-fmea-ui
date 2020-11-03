import {useEffect, useRef, useState} from "react";
import {Layer, Stage, useStrictMode} from "react-konva";
import * as React from "react";
import useStyles from "@components/editor/Editor.styles";
import {FailureMode} from "@models/failureModeModel";
import FaultEventShape from "@components/editor/shapes/FaultEventShape";
import {useSnackbar} from "@hooks/useSnackbar";
import * as joint from 'jointjs';
import JointEventShape from "@components/editor/shapes/JointEventShape";

interface EditorPros {
    failureMode: FailureMode
}

const Editor = ({failureMode}: EditorPros) => {
    const classes = useStyles()
    const [showSnackbar] = useSnackbar();

    const containerRef = useRef(null)
    const windowToolRef = useRef(null)

    const [container, setContainer] = useState<any>(undefined)

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

        setContainer(graph)
    }, []);

    return (
        <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}>
            {/*{*/}
            {/*    <Stage width={stageWidth} height={stageHeight}>*/}
            {/*        <Layer>*/}
            {/*            <FaultEventShape*/}
            {/*                showSnackbar={showSnackbar}*/}
            {/*                data={failureMode.manifestingNode}*/}
            {/*                position={{x: 150, y: 150}}/>*/}
            {/*        </Layer>*/}
            {/*    </Stage>*/}
            {/*}*/}
            <div id="editor-window-tool" className={classes.divWindowTool} ref={windowToolRef}/>
            {container && <JointEventShape graph={container} treeNode={failureMode.manifestingNode} />}
        </div>
    );
}

export default Editor;