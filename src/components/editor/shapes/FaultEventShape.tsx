import {Group, Rect, Text} from "react-konva";
import * as React from "react";
import {FailureMode} from "@models/failureModeModel";
import {useEffect, useState} from "react";
import {FaultEvent} from "@models/eventModel";
import {KonvaEventObject} from "konva/types/Node";
import {appTheme} from "@styles/App.styles";
import {Menu, MenuItem} from "@material-ui/core";
import Portal from "@components/editor/Portal";

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

    const rectPadding = appTheme.editor.shape.padding
    const [textRef, setTextRef] = useState<any>()
    useEffect(() => {
        if (textRef) {
            setRectWidth(textRef.textWidth + rectPadding)
            setRectHeight(textRef.textHeight + rectPadding)
        }
    })

    const suppressContextMenu = (e: KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault()
    }

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.button === 2) {
            setAnchorPos({
                mouseX: e.evt.clientX,
                mouseY: e.evt.clientY,
            })
        }
    }

    const showToolWindow = (e: KonvaEventObject<MouseEvent>) => {
        console.log('double clicked')
    }

    const initialAnchorPosition = {mouseX: null, mouseY: null,};
    const [anchorPos, setAnchorPos] = useState<{ mouseX: null | number; mouseY: null | number; }>(initialAnchorPosition)

    const renderMenu = (
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
            <MenuItem>Edit</MenuItem>
            <MenuItem>New Gate</MenuItem>
        </Menu>
    );

    return (
        <React.Fragment>
            <Group onContextMenu={suppressContextMenu}
                   onClick={handleClick}
                   onDblClick={showToolWindow}>
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
                    text={(data.manifestingNode.event as FaultEvent).name}
                    align="center"
                />
            </Group>
            <Portal>
                {renderMenu}
            </Portal>
        </React.Fragment>
    )
}

export default FaultEventShape;