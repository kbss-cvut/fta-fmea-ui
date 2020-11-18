import * as React from "react";
import useStyles from "./SidebarMenu.styles";
import {Divider, IconButton, Paper, Typography} from "@material-ui/core";
import {TreeNode} from "@models/treeNodeModel";
import ShapeToolPane from "./ShapeToolPane";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

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
            <div>
                <IconButton color="primary" onClick={onRestoreLayout} aria-label="restore layout">
                    <AccountTreeIcon/>
                </IconButton>
                <IconButton color="primary" onClick={onExportDiagram} aria-label="save">
                    <SaveAltIcon />
                </IconButton>
            </div>
            <Divider/>

            <Typography variant="h5" gutterBottom>Edit Event</Typography>
            <ShapeToolPane data={shapeToolData} onNodeUpdated={onNodeUpdated}/>
        </Paper>
    );
}

export default SidebarMenu;