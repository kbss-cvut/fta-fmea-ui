import * as React from "react";
import {Button, Dialog, Link} from "@material-ui/core";
import {DialogTitle} from "../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../materialui/dialog/DialogContent";
import {DialogActions} from "../../materialui/dialog/DialogActions";
import {useState} from "react";
import useStyles from "./PngExporter.styles";

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
    const classes = useStyles();

    const {encodedData, width, height} = exportData
    const b64Start = 'data:image/svg+xml;base64,';
    const imageData = b64Start + encodedData;

    const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    React.useEffect(() => {
        if (canvasRef) {
            const renderCtx = canvasRef.getContext('2d');

            if (renderCtx) {
                setContext(renderCtx);
            }
        }
    }, [canvasRef]);

    if (context) {
        const img = new Image(width, height);
        img.src = imageData;
        img.onload = () => {
            context.drawImage(img, 0, 0, width, height);
        };
    }

    const handleExport = (e) => {
        const png = canvasRef.toDataURL('image/png')
            .replace("image/png", "image/octet-stream");
        e.target.setAttribute('href', png);
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullScreen>
            <DialogTitle id="form-dialog-title" onClose={onClose}>Export Diagram</DialogTitle>
            <DialogContent dividers>
                <canvas ref={ref => setCanvasRef(ref)} width={width} height={height} className={classes.canvas}/>
            </DialogContent>
            <DialogActions>
                <Link variant="button" onClick={e => handleExport(e)} download="diagram.png">
                    Export & Save
                </Link>
            </DialogActions>
        </Dialog>
    );
}

export default PngExporter;