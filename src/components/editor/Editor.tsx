import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import {useEffect, useRef, useState} from "react";
import {Layer, Rect, Stage} from "react-konva";
import * as React from "react";
import EditorScrollTabs from "@components/editor/tabs/EditorScrollTabs";
import useStyles from "@components/editor/Editor.styles";


interface RectType {
    x: number,
    y: number
}

const Editor = () => {
    const classes = useStyles()
    const [rects, setRects] = useState<RectType[]>([]);

    const containerRef = useRef(null)
    const [stageWidth, setStageWidth] = useState(0)
    const [stageHeight, setStageHeight] = useState(0)

    useEffect(() => {
        setStageWidth(containerRef.current.clientWidth)
        setStageHeight(containerRef.current.clientHeight)
        console.log(stageHeight)
    }, []);

    const w = 50, h = 50
    const color = "blue"

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
        console.log(`${e.evt.x}, ${e.evt.y}`)
        setRects([...rects, {x: e.evt.x - 240, y: e.evt.y - 64}]) // TODO solve offsets
    };

    return (
        <div className={classes.konvaContainer} ref={containerRef}>
            <EditorScrollTabs/>
            {
                (stageWidth !== 0) && <Stage width={stageWidth} height={stageHeight} onClick={(e) => handleClick(e)}>
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
            }
        </div>
    );
}

export default Editor;