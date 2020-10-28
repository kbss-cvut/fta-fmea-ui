import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import {useState} from "react";
import {Layer, Rect, Stage} from "react-konva";
import * as React from "react";
import ScrollableTabsButtonAuto from "@components/editor/tabs/EditorScrollTabs";


interface RectType {
    x: number,
    y: number
}

const Editor = () => {
    const [rects, setRects] = useState<RectType[]>([]);

    const w = 50, h = 50
    const color = "blue"

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
        console.log(`${e.evt.x}, ${e.evt.y}`)
        setRects([...rects, {x: e.evt.x - 240, y: e.evt.y - 64}]) // TODO solve offsets
    };

    return (
        <React.Fragment>
            <ScrollableTabsButtonAuto/>
            <Stage width={window.innerWidth} height={window.innerHeight} onClick={(e) => handleClick(e)}>
                <Layer>
                    {
                        rects.map((value: RectType) => (
                            <Rect
                                x={value.x}
                                y={value.y}
                                width={w}
                                height={h}
                                draggable
                                fill={color}
                            />
                        ))
                    }
                </Layer>
            </Stage>
        </React.Fragment>
    );
}

export default Editor;