import {Group, Line, Rect, Text} from "react-konva";
import * as React from "react";
import {useEffect, useState} from "react";
import {EventType, FaultEvent, Gate} from "@models/eventModel";
import {appTheme} from "@styles/App.styles";
import {TreeNode} from "@models/treeNodeModel";
import {PositionProps} from "@utils/shapeUtils";
import FaultEventShape from "@components/editor/shapes/FaultEventShape";

// TODO use same props as for FaultEvent
interface GateShapeProps extends PositionProps {
    data: TreeNode<Gate>,
    showSnackbar: (string, SnackbarType) => void
}

const GateShape = ({data, position, parentPosition, showSnackbar}: GateShapeProps) => {
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
            {
                data.children.map((value, index) => {
                    return <FaultEventShape
                        data={value as TreeNode<FaultEvent>} showSnackbar={showSnackbar}
                        position={{x: position.x + 50 * (index + 1), y: position.y + 50}} parentPosition={position}
                        key={`event-${value.iri}`}
                    />
                })
            }
            {
                <Line
                    key={`connector-line-from-${data.iri}`}
                    points={[position.x, position.y, parentPosition.x, parentPosition.y]}
                    stroke={appTheme.editor.shape.strokeColor}
                    strokeWidth={appTheme.editor.shape.strokeWidth}
                />
            }
        </Group>
    )
}

export default GateShape;