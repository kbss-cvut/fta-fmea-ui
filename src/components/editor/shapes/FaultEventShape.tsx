import {Rect, Text} from "react-konva";
import * as React from "react";
import {FailureMode} from "@models/failureModeModel";
import {useEffect, useState} from "react";
import {FaultEvent} from "@models/eventModel";
import {appTheme} from "../../../App";

interface FaultEventShapeProps {
    data: FailureMode,
    position: ShapePosition
}

interface ShapePosition {
    x: number,
    y: number
}

const useWindowSize = () =>  {
    const [size, setSize] = useState([0, 0]);

    return size;
}

const FaultEventShape = ({data, position}: FaultEventShapeProps) => {
    const [rectWidth, setRectWidth] = useState<number>(50)
    const [rectHeight, setRectHeight] = useState<number>(50)

    const rectPadding = appTheme.editor.shape.padding
    const [textRef, setTextRef] = useState<any>()
    useEffect(() => {
        if (textRef) {
            setRectWidth(textRef.textWidth + rectPadding)
            setRectHeight(textRef.textHeight + rectPadding)
        }
    })

    return (
        <React.Fragment>
            <Rect
                x={position.x}
                y={position.y}
                width={rectWidth}
                height={rectHeight}
                stroke={appTheme.editor.shape.strokeColor}
                strokeWidth={appTheme.editor.shape.strokeWidth}
                onClick={() => console.log(data)}
            />
            <Text
                ref={ref => setTextRef(ref)}
                x={position.x + rectPadding / 2}
                y={position.y + rectPadding / 2}
                fontSize={appTheme.editor.fontSize}
                text={(data.manifestingNode.event as FaultEvent).name}
                align="center"
            />
        </React.Fragment>

    )
}

export default FaultEventShape;