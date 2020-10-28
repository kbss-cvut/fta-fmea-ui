import * as React from "react";
import useStyles from "@components/drawer/DrawerContent.styles";
import {Layer, Rect, Stage} from "react-konva";
import {useState} from "react";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

interface RectType {
    x: number,
    y: number
}

const DrawerContent = () => {
    const classes = useStyles();

    const [rects, setRects] = useState<RectType[]>([]);

    const w = 50, h = 50
    const color = "blue"

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
        console.log(`${e.evt.x}, ${e.evt.y}`)
        setRects([...rects, {x: e.evt.x - 240, y: e.evt.y}])
    };

    return (
        <div>
            <div className={classes.drawerHeader}/>
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
        </div>
    );
}

export default DrawerContent;