import {Arrow, Group, Line, Rect, Text} from "react-konva";
import * as React from "react";
import {useEffect, useState} from "react";
import {EventType, FaultEvent, Gate} from "@models/eventModel";
import {appTheme} from "@styles/App.styles";
import {TreeNode} from "@models/treeNodeModel";
import {PositionProps} from "@utils/shapeUtils";
import FaultEventShape from "@components/editor/shapes/FaultEventShape";
import GateDialog from "@components/dialog/gate/GateDialog";
import Portal from "@components/editor/Portal";
import {Menu, MenuItem} from "@material-ui/core";
import FaultEventDialog from "@components/dialog/faultEvent/FaultEventDialog";
import {KonvaEventObject} from "konva/types/Node";

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

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.button === 2) {
            setAnchorPos({
                mouseX: e.evt.clientX,
                mouseY: e.evt.clientY,
            })
        }
    }

    const initialAnchorPosition = {mouseX: null, mouseY: null,};
    const [anchorPos, setAnchorPos] = useState<{ mouseX: null | number; mouseY: null | number; }>(initialAnchorPosition)

    const gateMenu = (
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
            <MenuItem key="gate-menu-edit">Edit</MenuItem>
            <MenuItem key="gate-menu-new-event" onClick={() => {
                setAnchorPos(initialAnchorPosition)
                setEventDialogOpen(true)
            }}>
                New Event
            </MenuItem>
        </Menu>
    );

    const [eventDialogOpen, setEventDialogOpen] = useState(false)
    const handleEventCreated = (faultEvent: TreeNode<FaultEvent>) => {
        console.log(`handleEventCreated - ${faultEvent.iri}`)
        data.children.push(faultEvent)
    }

    return (
        <React.Fragment>
            <Group onContextMenu={(e) => e.evt.preventDefault()}
                   onClick={handleClick}>
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
            {
                data.children.map((value, index) => {
                    return <FaultEventShape
                        data={value as TreeNode<FaultEvent>} showSnackbar={showSnackbar}
                        position={{x: position.x + 100 * (index), y: position.y + 50}} parentPosition={position}
                        key={`event-${value.iri}`}
                    />
                })
            }
            {
                <Arrow
                    key={`connector-line-from-${data.iri}`}
                    points={[position.x, position.y, parentPosition.x, parentPosition.y]}
                    stroke={appTheme.editor.shape.strokeColor}
                    fill={appTheme.editor.shape.strokeColor}
                    strokeWidth={appTheme.editor.shape.strokeWidth}
                />
            }
            <Portal>
                {gateMenu}
                {eventDialogOpen && <FaultEventDialog treeNodeIri={data.iri} onEventCreated={handleEventCreated}
                                                      onClose={() => setEventDialogOpen(false)}
                                                      showSnackbar={showSnackbar}/>}
            </Portal>
        </React.Fragment>
    )
}

export default GateShape;