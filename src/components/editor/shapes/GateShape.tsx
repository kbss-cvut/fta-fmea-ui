import {Group, Rect, Text} from "react-konva";
import * as React from "react";
import {useEffect, useState} from "react";
import {Gate} from "@models/eventModel";
import {appTheme} from "@styles/App.styles";
import {TreeNode} from "@models/treeNodeModel";
import {PositionProps} from "@utils/shapeUtils";

interface GateShapeProps extends PositionProps {
    data: TreeNode<Gate>,
}

const GateShape = ({data, position}: GateShapeProps) => {
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
        <Group>
            <Rect
                x={position.x}
                y={position.y}
                width={rectWidth}
                height={rectHeight}
                stroke={appTheme.editor.shape.strokeColor}
                strokeWidth={appTheme.editor.shape.strokeWidth}
            />
            <Text
                ref={ref => setTextRef(ref)}
                x={position.x + rectPadding / 2}
                y={position.y + rectPadding / 2}
                fontSize={appTheme.editor.fontSize}
                text={(data.event as Gate).gateType}
                align="center"
            />
        </Group>
    )
}

export default GateShape;