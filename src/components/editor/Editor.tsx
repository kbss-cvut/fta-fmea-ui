import {useEffect, useRef, useState} from "react";
import {Layer, Stage, useStrictMode} from "react-konva";
import * as React from "react";
import useStyles from "@components/editor/Editor.styles";
import {FailureMode} from "@models/failureModeModel";
import FaultEventShape from "@components/editor/shapes/FaultEventShape";
import {useSnackbar} from "@hooks/useSnackbar";

interface EditorPros {
    failureMode: FailureMode
}

useStrictMode(true);

const Editor = ({failureMode}: EditorPros) => {
    const classes = useStyles()
    const [showSnackbar] = useSnackbar();

    const containerRef = useRef(null)
    const [stageWidth, setStageWidth] = useState(0)
    const [stageHeight, setStageHeight] = useState(0)

    useEffect(() => {
        setStageWidth(containerRef.current.clientWidth)
        setStageHeight(containerRef.current.clientHeight)
    }, []);

    // TODO calculate shape position!
    return (
        <div className={classes.konvaContainer} ref={containerRef}>
            {
                <Stage width={stageWidth} height={stageHeight}>
                    <Layer>
                        <FaultEventShape
                            showSnackbar={showSnackbar}
                            data={failureMode.manifestingNode}
                            position={{x: 150, y: 150}}/>
                    </Layer>
                </Stage>
            }
        </div>
    );
}

export default Editor;