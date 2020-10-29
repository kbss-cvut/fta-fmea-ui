import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import {useEffect, useRef, useState} from "react";
import {Layer, Rect, Stage} from "react-konva";
import * as React from "react";
import EditorScrollTabs from "@components/editor/tabs/EditorScrollTabs";
import useStyles from "@components/editor/Editor.styles";
import {FailureMode} from "@models/failureModeModel";
import FaultEventShape from "@components/editor/shapes/FaultEventShape";

interface EditorPros {
    failureMode: FailureMode
}

const Editor = ({failureMode}: EditorPros) => {
    const classes = useStyles()

    const containerRef = useRef(null)
    const [stageWidth, setStageWidth] = useState(0)
    const [stageHeight, setStageHeight] = useState(0)

    useEffect(() => {
        setStageWidth(containerRef.current.clientWidth)
        setStageHeight(containerRef.current.clientHeight)
    }, []);

    return (
        <div className={classes.konvaContainer} ref={containerRef}>
            {
                (stageWidth !== 0) && <Stage width={stageWidth} height={stageHeight}>
                    <Layer>
                        {/*TODO calculate shape position!*/}
                        <FaultEventShape data={failureMode} position={{x: 150, y: 150}}/>
                    </Layer>
                </Stage>
            }
        </div>
    );
}

export default Editor;