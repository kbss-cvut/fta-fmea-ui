import * as React from "react";
import {Button, Dialog} from "@material-ui/core";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";
import {DialogActions} from "@components/dialog/custom/DialogActions";
import {useEffect, useState} from "react";

export interface PngExportData {
    encodedData: any,
    width: number,
    height: number,
}

interface Props {
    exportData: PngExportData
    open: boolean,
    onClose: () => void
}

const PngExporter = ({exportData, open, onClose}: Props) => {
    const {encodedData, width, height} = exportData
    const b64Start = 'data:image/svg+xml;base64,';
    const imageData = b64Start + encodedData;

    const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>()

    // useEffect(() => {
    //     console.log('useEffect')
    //     if (canvasRef) {
    //         // @ts-ignore
    //         const context = canvasRef.getContext('2d');
    //
    //         const image = new Image(width, height);
    //         image.src = imageData;
    //         // @ts-ignore
    //         image.onload = () => {
    //             console.log('onLoad')
    //             context.drawImage(image, 0, 0, width, height);
    //             forceRender(true)
    //         };
    //     }
    // }, [canvasRef])

    console.log('render')

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullScreen>
            <DialogTitle id="form-dialog-title" onClose={onClose}>Export Diagram</DialogTitle>
            <DialogContent dividers>
                <img width={width} height={height} src={imageData}/>
                {/*<canvas width={width} height={height} ref={ref => setCanvasRef(ref)}/>*/}
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