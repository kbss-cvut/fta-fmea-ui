import * as React from "react";
import useStyles from "@components/drawer/DrawerContent.styles";
import {Layer, Rect, Stage} from "react-konva";
import {useState} from "react";
import Konva from "konva";

const DrawerContent = () => {
    const classes = useStyles();

    const [color, setColor] = useState("blue");

    const handleClick = () => {
        setColor(Konva.Util.getRandomColor())
    };

    return (
        <div>
            <div className={classes.drawerHeader}/>
            {/*TODO customize height, width*/}
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Rect
                        x={20}
                        y={20}
                        width={50}
                        height={50}
                        draggable
                        fill={color}
                        onClick={handleClick}
                    />
                </Layer>
            </Stage>
        </div>
    );
}

export default DrawerContent;