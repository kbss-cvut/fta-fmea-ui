import * as React from "react";
import {Button, Dialog} from "@material-ui/core";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";
import GateCreation from "@components/dialog/gate/GateCreation";
import {DialogActions} from "@components/dialog/custom/DialogActions";
import {useEffect, useRef, useState} from "react";

interface Props {
    dataToExport: string,
    open: boolean,
    onClose: () => void
}

const PngExporter = ({dataToExport, open, onClose}: Props) => {
    const encodedData = dataToExport;

    const b64Start = 'data:image/svg+xml;base64,';
    const imageData = b64Start + encodedData;
    console.log(imageData)

    const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>()

    useEffect(() => {
        if (canvasRef) {
            const ctx = canvasRef.getContext('2d')
            // @ts-ignore
            ctx.drawSvg(imageData, 0, 0)
        }
    }, [canvasRef])

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullScreen>
            <DialogTitle id="form-dialog-title" onClose={onClose}>Export Diagram</DialogTitle>
            <DialogContent dividers>
                <img width={window.innerWidth} height={window.innerHeight} src={imageData}/>
                {/*<canvas width={window.innerWidth} height={window.innerHeight}*/}
                {/*        ref={(ref) => setCanvasRef(ref)}/>*/}
            </DialogContent>
            <DialogActions>
                <Button color="primary">
                    Export & Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PngExporter;