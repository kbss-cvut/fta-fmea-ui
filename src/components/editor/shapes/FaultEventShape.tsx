import * as React from "react";
import {Arrow, Group, Rect, Text} from "react-konva";
import {useEffect, useState} from "react";
import {EventType, FaultEvent, Gate} from "@models/eventModel";
import {KonvaEventObject} from "konva/types/Node";
import {appTheme} from "@styles/App.styles";
import {Menu, MenuItem} from "@material-ui/core";
import Portal from "@components/editor/Portal";
import GateDialog from "@components/dialog/gate/GateDialog";
import {TreeNode} from "@models/treeNodeModel";
import {EventShapeProps} from "@utils/shapeUtils";
import GateShape from "@components/editor/shapes/GateShape";
import {flatten} from "@utils/arrayUtils";

const FaultEventShape = ({data, position, showSnackbar, parentPosition}: EventShapeProps<FaultEvent>) => {
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
            <MenuItem key="event-menu-new-gate" onClick={() => {
                setAnchorPos(initialAnchorPosition)
                setGateDialogOpen(true)
            }}>
                New Gate
            </MenuItem>
        </Menu>
    );

    const [gateDialogOpen, setGateDialogOpen] = useState(false)
    const handleGateCreated = (gate: TreeNode<Gate>) => {
        console.log(`handleGateCreated - ${gate.iri}`)
        data.children.push(gate)
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
                    text={(data.event as FaultEvent).name}
                    align="center"
                />
            </Group>
            {
                flatten([data.children]).map((value, index) => {
                    return <GateShape data={value as TreeNode<Gate>}
                                      position={{
                                          x: position.x,
                                          y: position.y + (50 * (1 + index))
                                      }} // TODO resolve offset
                                      parentPosition={position}
                                      key={`gate-${value.iri}`} showSnackbar={showSnackbar}/>
                })
            }
            {
                (data.event as FaultEvent).eventType !== EventType.TOP_EVENT && parentPosition &&
                <Arrow
                    key={`connector-line-from-${data.iri}`}
                    points={[position.x, position.y, parentPosition.x, parentPosition.y]}
                    stroke={appTheme.editor.shape.strokeColor}
                    fill={appTheme.editor.shape.strokeColor}
                    strokeWidth={appTheme.editor.shape.strokeWidth}
                />
            }
            <Portal>
                {eventMenu}
                {gateDialogOpen && <GateDialog treeNodeIri={data.iri} onGateCreated={handleGateCreated}
                                               onClose={() => setGateDialogOpen(false)} showSnackbar={showSnackbar}/>}
            </Portal>
        </React.Fragment>
    )
}

export default FaultEventShape;