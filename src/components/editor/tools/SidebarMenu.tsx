import * as React from "react";
import useStyles from "./SidebarMenu.styles";
import {Button, Divider, Paper, Typography} from "@material-ui/core";
import {TreeNode} from "@models/treeNodeModel";
import ShapeToolPane from "./ShapeToolPane";

interface Props {
    onRestoreLayout: () => void,
    onExportDiagram: () => void,
    shapeToolData?: TreeNode,
    onNodeUpdated: (node: TreeNode) => void,
}

const SidebarMenu = ({onRestoreLayout, onExportDiagram, shapeToolData, onNodeUpdated}: Props) => {
    const classes = useStyles()

    return (
        <Paper className={classes.paper} elevation={3}>
            <Typography variant="h5" gutterBottom>Diagram Options</Typography>
            <div className={classes.diagramOptions}>
                <Button color="primary" onClick={onRestoreLayout}>Restore Layout</Button>
                <Button color="primary" onClick={onExportDiagram}>Export Diagram</Button>
            </div>
            <Divider/>

            <Typography variant="h5" gutterBottom>Edit Event</Typography>
            <ShapeToolPane data={shapeToolData} onNodeUpdated={onNodeUpdated}/>
        </Paper>
    );
}

export default SidebarMenu;