import {Rect, Text} from "react-konva";
import * as React from "react";
import {FailureMode} from "@models/failureModeModel";
import {RefObject, useEffect, useRef, useState} from "react";
import {FaultEvent} from "@models/eventModel";

interface FaultEventShapeProps {
    data: FailureMode,
    position: ShapePosition
}

interface ShapePosition {
    x: number,
    y: number
}

const FaultEventShape = ({data, position}: FaultEventShapeProps) => {
    const [rectWidth, setRectWidth] = useState<number>(50)
    const [rectHeight, setRectHeight] = useState<number>(50)

    return (
        <React.Fragment>
            <Rect
                x={position.x}
                y={position.y}
                width={rectWidth}
                height={rectHeight}
                fill="blue"
                onClick={() => console.log(data)}
            />
            <Text
                x={position.x}
                y={position.y}
                fontSize={15}
                text={(data.manifestingNode.event as FaultEvent).name}
                align="center"
                fill="white"
            />
        </React.Fragment>

    )
}

export default FaultEventShape;